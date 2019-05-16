import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import axios from 'axios';
import languages from './data/languages';

const FormGroup = styled.div``;

axios.defaults.baseURL = process.env.API_URL;

const API = {
  translate: async (data) => {
    const response = await axios.post('/translate', {
      from: data.from,
      to: data.to,
      text: data.text,
    });

    return response.data;
  },
};

class App extends React.Component {
  state = {
    from: '',
    to: '',
    text: '',
    translation: '',
    // file: null,
  };

  handleChange = (event) => {
    const { target: { name, value } } = event;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { state } = this;

    const { translation } = await API.translate({
      from: state.from,
      to: state.to,
      text: state.text,
    });

    this.setState({ translation });
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
            <button type="submit">Translate!</button>
          </FormGroup>
        </form>

        {state.translation && (
          <h2>{state.translation}</h2>
        )}
      </React.Fragment>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
