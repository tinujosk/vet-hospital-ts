import React from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import i18n from './i18n';
import './index.css';

const Root = () => (
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <App />
      </Provider>
    </I18nextProvider>
  </React.StrictMode>
);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<Root />);
