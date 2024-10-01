import {
  NumberInput,
  ActionIcon,
  Button,
  Space,
  Paper,
  Center,
  LoadingOverlay,
  Textarea,
  SegmentedControl,
  Divider,
  Text,
  Checkbox,
  Group,
  Collapse,
  Popover,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { Image as MantineImage } from "@mantine/core";
import { useForm } from "@mantine/form";
import { createStyles } from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import MangoLatestStatus from "./MangoLatestStatus";
import { formatISO } from "date-fns";
import { resourceAxiosInstance } from "./services/AxiosService";
import { useHistory } from "react-router-dom";
import { FaDatabase } from "react-icons/fa";
import AuthHeader from "./util/authHeaderHelper";
import TokenService from "./services/TokenService";
import { getCurrentTime, notifyOK, notifyKO } from "./util/utils";
import { useMediaQuery } from "@mantine/hooks";

const UpdateMango = ({ mango }) => {
  const mangoTitle = mango.mango.mangoTitle;
  const mangoStatus = mango.mango.status;
  const lastChapterRead = mango.lastChapterRead;
  const lastReadTime = mango.lastReadTime;
  const bannerImg = mango.mango.bannerImg;
  const anilistId = mango.mango.anilistId;
  const remarks = mango.remarks;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingFinished, setSubmittingFinished] = useState(false);
  const history = useHistory();
  const [finalChapter, setFinalChapter] = useState(0);
  const isMobile = useMediaQuery("(max-width: 56.25em)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");
  const INFO = "INFO";
  const UPDATE = "UPDATE";
  const [tab, setTab] = useState(INFO);

  const [markAsFinished, setMarkAsFinished] = useState(false);

  const [isBacklogPage, setIsBacklogPage] = useState(false);
  const [isCtlyReadingPage, setIsCtlyReadingPage] = useState(false);
  const chapterInputHandler = useRef();

  const form = useForm({
    initialValues: {
      title: mangoTitle,
      status: mangoStatus,
      lastChapterRead: lastChapterRead,
      lastReadTime: lastReadTime,
      remarks: remarks ? remarks : "",
    },
    validate: {
      lastChapterRead: (value) =>
        value <= lastChapterRead
          ? "Chapter must be greater than current chapter read"
          : null,

      remarks: (value) =>
        value === remarks
          ? "New remarks must not be the same as previous"
          : null,
    },
  });

  const useStyles = createStyles((theme) => ({
    Form: {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
      color: theme.colors.dark[0],
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizes.lg,
      marginTop: "0.5em",
      // position:'absolute',
      // top: '50%',
      // left: '50%',
      // transform: 'translate(-50%, -50%)',
      // msTransform: 'translate(-50%, -50%)',
      [`@media (min-width: 500px)`]: {
        // display:'flex'
      },
    },
    inputs: {
      // maxWidth: '20em',
      width: "10em",
      input: {
        height: "auto",
      },

      label: {
        fontSize: theme.fontSizes.sm,
      },
    },
    paperDiv: {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
      color: theme.colors.dark[0],
      // maxWidth: "50em",
      // maxWidth: "50em",
      // minWidth: "25em",
      width: "50em",
      overflow: "hidden",
      height: "30em",
      overflow: "visible",
      //paddingBottom: "2em",
      // minHeight: "10em",
      // maxHeight: "40em",
    },
    paperDivNoImage: {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
      color: theme.colors.dark[0],

      width: "25em",
      overflow: "hidden",
      height: "21em",
    },
    chapterInput: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    mangoTitle: {
      textAlign: "center",
      margin: "0 0.5em",
    },
  }));
  const { classes } = useStyles();

  useEffect(() => {
    if (submittingFinished) {
      notifyOK();
      setTimeout(() => history.go(0), 1000);
    }
  }, [submittingFinished]);

  useEffect(() => {
    if (mango.completionDateTime) {
      setMarkAsFinished(true);
    } else if (mango.addedDateTime) {
      setIsBacklogPage(true);
    } else if (mango.lastReadTime) {
      setIsCtlyReadingPage(true);
    }
  }, []);

  const getUpdateEndpoint = () => {
    if (markAsFinished && mango.lastReadTime) {
      return "/updateMangoFinish";
    } else if (markAsFinished && mango.completionDateTime) {
      return "/updateFinishedRemarks";
    } else {
      return "updateMango";
    }
  };

  const getUpdatePayload = (values) => {
    if (markAsFinished && mango.completionDateTime) {
      return {
        remarks: values.remarks,
        anilistId: anilistId,
      };
    } else {
      const mangoTitleForm = values.title;
      const lastChapterReadForm = values.lastChapterRead;
      const currentDate = new Date();
      const newLastReadTime =
        formatISO(currentDate, { representation: "date" }) +
        "T" +
        getCurrentTime(currentDate);
      const mango = {
        mangoTitle: mangoTitleForm,
        lastChapterRead: lastChapterReadForm,
        lastReadTime: newLastReadTime,
        user: TokenService.getUsername(),
        anilistId: anilistId,
      };
      if (values.remarks) {
        mango.remarks = values.remarks;
      }
      if (isBacklogPage) {
        mango.lastChapterRead = 1;
      }
      return mango;
    }
  };

  const submitMangoUpdate = (values) => {
    setIsSubmitting(true);
    const mango = getUpdatePayload(values);

    setTimeout(() => {
      resourceAxiosInstance.service
        .put(getUpdateEndpoint(), mango, {
          headers: AuthHeader.getAuthHeader(),
        })
        .then(
          (response) => {
            console.log(response);
            setIsSubmitting(false);
            setSubmittingFinished(true);
          },
          (error) => {
            notifyKO(error.message);
            console.log(error);
            setIsSubmitting(false);
            setSubmittingFinished(false);
          }
        );
    }, 1000);
  };

  function ChapterInput({ min, max, label, currentChapter }) {
    return (
      <div className={classes.chapterInput}>
        <Text size={14}>{label}</Text>

        <Group spacing={5}>
          <ActionIcon
            size="2.2em"
            variant="default"
            onClick={() => chapterInputHandler.current.decrement()}
          >
            –
          </ActionIcon>
          <NumberInput
            hideControls
            handlersRef={chapterInputHandler}
            max={max}
            min={min}
            step={1}
            value={currentChapter}
            styles={{ input: { width: "5em", textAlign: "center" } }}
            size="sm"
          />
          <ActionIcon
            size="2.2em"
            variant="default"
            onClick={() => chapterInputHandler.current.increment()}
          >
            +
          </ActionIcon>
        </Group>
      </div>
    );
  }

  function PlaceHolder() {
    return (
      <MantineImage withPlaceholder width="100%" height="25em" src={null} />
    );
  }

  return (
    <div className={bannerImg ? classes.paperDiv : classes.paperDivNoImage}>
      {/*position relative for form to enable LoadingOverlay to work nicely*/}
      <form
        style={{ position: "relative", margin: 0 }}
        onSubmit={form.onSubmit((values) => submitMangoUpdate(values))}
      >
        <LoadingOverlay visible={isSubmitting} />
        {
          bannerImg && (
            <MantineImage width="100%" height="200px" src={bannerImg} />
          )
          // : (
          //   !isMobile && <PlaceHolder />
          // )
        }
        {!submittingFinished && (
          <Paper p={bannerImg && !isMobile ? 0 : "sm"} className={classes.Form}>
            <Center>
              <Text
                weight={900}
                size="lg"
                lineClamp={2}
                className={classes.mangoTitle}
              >
                {mangoTitle}
              </Text>
            </Center>
            <Space h="sm" />
            <Center>
              <SegmentedControl
                radius="xs"
                color="gray"
                value={tab}
                onChange={setTab}
                size="sm"
                data={[
                  {
                    label: (
                      <Text weight={800} size="xs">
                        INFO
                      </Text>
                    ),
                    value: INFO,
                  },
                  {
                    label: (
                      <Text weight={800} size="xs">
                        UPDATE
                      </Text>
                    ),
                    value: UPDATE,
                  },
                ]}
              />
            </Center>
            <Divider my="sm" />
            {tab === INFO && (
              <MangoLatestStatus
                mango={mango}
                setFinalChapter={setFinalChapter}
              />
            )}
            {tab === UPDATE && isCtlyReadingPage && (
              <Collapse in={tab === UPDATE && isCtlyReadingPage}>
                <ChapterInput
                  min={lastChapterRead}
                  max={!finalChapter ? lastChapterRead + 1000 : finalChapter}
                  currentChapter={lastChapterRead}
                  {...form.getInputProps("lastChapterRead")}
                  label="Last chapter read"
                />
                <Space h="xl" />
                <Center>
                  <Checkbox
                    checked={markAsFinished}
                    onChange={(event) =>
                      setMarkAsFinished(event.currentTarget.checked)
                    }
                    label="Mark as finished"
                  />
                </Center>
                <Space h="xs" />
                <Center>
                  <Button
                    disabled={form.values.lastChapterRead === lastChapterRead}
                    size="sm"
                    type="submit"
                    rightIcon={<FaDatabase size={15} />}
                  >
                    SAVE
                  </Button>
                </Center>
                <Space h="xs" />
              </Collapse>
            )}
            {tab === UPDATE && markAsFinished && !isMobile && (
              <Collapse in={tab === UPDATE && markAsFinished && !isMobile}>
                <Center>
                  <Textarea
                    style={{
                      width: "85%",
                    }}
                    label="Remarks"
                    minRows={4}
                    size="md"
                    variant="default"
                    placeholder={mango.remarks ? mango.remarks : ""}
                    {...form.getInputProps("remarks")}
                  />
                </Center>
                <Space h="md" />
                <Center>
                  <Button
                    disabled={form.values.remarks === remarks}
                    size="sm"
                    type="submit"
                    rightIcon={<FaDatabase size={15} />}
                  >
                    SAVE
                  </Button>
                </Center>

                <Space h="xs" />
              </Collapse>
            )}
            {tab === UPDATE && isBacklogPage && (
              <Collapse in={tab === UPDATE && isBacklogPage}>
                <ChapterInput
                  min={1}
                  max={20000} //max theoretical chapter count in the whole universe
                  currentChapter={1}
                  {...form.getInputProps("lastChapterRead")}
                  label="Mark as currently reading at chapter"
                />
                <Space h="md" />
                <Center>
                  <Button
                    disabled={form.values.lastChapterRead === 0}
                    size="sm"
                    type="submit"
                    rightIcon={<FaDatabase size={15} />}
                  >
                    SAVE
                  </Button>
                </Center>
                <Space h="xs" />
              </Collapse>
            )}
          </Paper>
        )}
      </form>
    </div>
  );
};
export default UpdateMango;
