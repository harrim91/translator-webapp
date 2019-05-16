import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import axios from 'axios';
import languages from './data/languages';

const FormGroup = styled.div``;

axios.defaults.baseURL = process.env.API_URL;

const API = {
  translate: async (data) => {
    let file = null;

    if (data.file) {
      const upload = await axios.get('/upload');

      await axios.put(upload.data.url, data.file);

      file = upload.data.key;
    }

    const response = await axios.post('/translate', {
      from: data.from,
      to: data.to,
      text: data.text,
      file,
    });

    return response.data;
  },
};

class App extends React.Component {
  state = {
    from: '',
    to: '',
    text: '',
    file: null,
    translation: null,
  };

  handleChange = (event) => {
    const { target: { name, value } } = event;
    this.setState({
      [name]: value,
    });
  };

  handleFileChange = (event) => {
    const { target: { name, files } } = event;
    this.setState({
      [name]: files[0],
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({ translation: null }, async () => {
      const { state } = this;

      const translation = await API.translate({
        from: state.from,
        to: state.to,
        text: state.text,
        file: state.file,
      });

      this.setState({ translation });
    });
  };

  render() {
    const { state } = this;
    return (
      <React.Fragment>
        <h1>
          Translator
        </h1>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <label htmlFor="from">
              From:
              <select name="from" value={state.from} onChange={this.handleChange}>
                {state.from === '' && <option value="">-</option>}
                {languages.map(language => (
                  <option
                    key={language.code}
                    value={language.code}
                    disabled={language.code === state.to}
                  >
                    {language.name}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="to">
              To:
              <select name="to" value={state.to} onChange={this.handleChange}>
                {state.to === '' && <option value="">-</option>}
                {languages.map(language => (
                  <option
                    key={language.code}
                    value={language.code}
                    disabled={language.code === state.from}
                  >
                    {language.name}
                  </option>
                ))}
              </select>
            </label>
          </FormGroup>

          <FormGroup>
            <label htmlFor="text">
              Text:
              <textarea name="text" value={state.text} onChange={this.handleChange} />
            </label>
          </FormGroup>

          <FormGroup>
            <label htmlFor="file">
              File:
              <input name="file" type="file" accept="image/jpeg,image/png" onChange={this.handleFileChange} />
            </label>
          </FormGroup>

          {state.file && (
            <FormGroup>
              <img alt={state.file.name} src={URL.createObjectURL(state.file)} />
            </FormGroup>
          )}

          <FormGroup>
            <button type="submit">Translate!</button>
          </FormGroup>
        </form>

        {state.translation && (
          <React.Fragment>
            <h2>{state.translation.translation}</h2>
            {state.text === '' && (
              <React.Fragment>
                <p>Detected text:</p>
                <p>{state.translation.source}</p>
              </React.Fragment>
            )}
            <p>
              Translated from
              {' '}
              {languages.find(l => l.code === state.translation.sourceLanguage).name}
              {' '}
              {state.from === '' ? '(Detected) ' : ''}
              to
              {' '}
              {languages.find(l => l.code === state.translation.targetLanguage).name}
            </p>
            {state.translation.audio && (
              <audio controls> {/* eslint-disable-line */}
                <source src={state.translation.audio} type="audio/mp3" />
              </audio>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
