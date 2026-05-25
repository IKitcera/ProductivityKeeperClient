module.exports = {
  content: [
    './src/**/*.{html,ts,scss}',
    './src/app/**/*.{html,ts,scss}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Inter — body copy, labels, UI elements
        sans: ['Inter', 'Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Outfit — headings, display text, splash screen titles
        display: ['Outfit', 'ui-sans-serif', 'sans-serif'],
        // Roboto Mono — code snippets, monospaced values
        mono: ['Roboto Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Design-system scale tied to the project's density-0 Material theme
        '2xs': ['0.625rem',  { lineHeight: '0.875rem' }], // 10 px
        xs:   ['0.75rem',   { lineHeight: '1rem'      }], // 12 px
        sm:   ['0.875rem',  { lineHeight: '1.25rem'   }], // 14 px
        base: ['1rem',      { lineHeight: '1.5rem'    }], // 16 px
        lg:   ['1.125rem',  { lineHeight: '1.75rem'   }], // 18 px
        xl:   ['1.25rem',   { lineHeight: '1.75rem'   }], // 20 px
        '2xl':['1.5rem',    { lineHeight: '2rem'      }], // 24 px
        '3xl':['1.875rem',  { lineHeight: '2.25rem'   }], // 30 px
        '4xl':['2.25rem',   { lineHeight: '2.5rem'    }], // 36 px
        '5xl':['3rem',      { lineHeight: '1.1'       }], // 48 px
        '6xl':['3.75rem',   { lineHeight: '1'         }], // 60 px
        '7xl':['4.5rem',    { lineHeight: '1'         }], // 72 px
        '8xl':['6rem',      { lineHeight: '1'         }], // 96 px
      },
      fontWeight: {
        light:     '300',
        normal:    '400',
        medium:    '500',
        semibold:  '600',
        bold:      '700',
        extrabold: '800',
        black:     '900',
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight:   '-0.02em',
        normal:  '0em',
        wide:    '0.04em',
        wider:   '0.08em',
        widest:  '0.18em',   // badge / label caps
      },
    },
  },
  plugins: [],
}
