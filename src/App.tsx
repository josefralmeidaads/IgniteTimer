import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';

import { defaultTheme } from './styles/themes/default';
import { GlobalStyle } from './styles/global';
import Router from './routes/router';
import { CyclesContextProvider } from './contexts/CyclesContext';

function App() {
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <BrowserRouter>
          <GlobalStyle />
          <CyclesContextProvider>
            <Router />
          </CyclesContextProvider>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
