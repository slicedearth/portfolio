import React from "react"
export default function ContactForm() {
  return (
    <section id="contact" className="section section-padding">
      <h3 className="is-size-2 has-text-centered pb-3 has-text-weight-bold">
        Contact
      </h3>
      <div className="columns is-centered">
        <div className="column is-four-fifths">
          <form
            name="contact"
            method="post"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
          >
            <input type="hidden" name="form-name" value="contact" />
            <input type="hidden" name="bot-field" />
            <div className="field">
              <label htmlFor="nameInput" className="label">
                Name
                <div className="control">
                  <input
                    className="input"
                    id="nameInput"
                    type="text"
                    placeholder="Your Name"
                    name="name"
                    required
                  />
                </div>
              </label>
            </div>

            <div className="field">
              <label htmlFor="emailInput" className="label">
                Email
                <div className="control">
                  <input
                    className="input"
                    id="emailInput"
                    type="email"
                    placeholder="Your Email Address"
                    name="email"
                    required
                  />
                </div>
              </label>
            </div>
            <div className="field">
              <label htmlFor="messageInput" className="label">
                Message
                <div className="control">
                  <textarea
                    className="textarea"
                    id="messageInput"
                    placeholder="Your Message"
                    name="message"
                    required
                  ></textarea>
                </div>
              </label>
            </div>
            <div className="field">
              <div className="control">
                <button
                  type="submit"
                  className="button is-dark is-fullwidth has-text-weight-semibold"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
