import { Global } from '@mantine/core';

function GlobalStyles() {
    return (
        <Global
            styles={(theme) => ({
                fontFamily: 'Quicksand, sans-serif',
                h1:
                {
                    textAlign: 'center',
                    fontSize: '48px',
                    fontWeight: 800,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    top: `20px`,
                },
                '.optionBtn': {
                    fontSize: theme.fontSizes.xs,
                    width: '100%'
                },

                '.btnGroup': {
                    [`@media (max-width: 1024px)`]: {
                        display: 'grid',
                        gridTemplateRows: 'repeat(3, minmax(0, 1fr))',
                    },
                },
                '.standardFont': {
                    textTransform: 'uppercase',
                },
                '.logoOnly': {
                    letterSpacing: '2px',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    justifyContent: 'center'

                },
                '.headerLinkWrapper': {
                    display: 'inline-block',
                    padding: '0',
                    margin: '15px 25px',
                    position: 'relative',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    fontWeight: '800',
                    fontSize: '1rem',
                    // bottom: '6',
                    shadows: theme.shadows.xl,


                    [`@media (max-width: 1024px)`]: {
                        fontSize: theme.fontSizes.md,
                    },
                }

            })}
        />
    );
}

export default GlobalStyles;
