import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HardCoded = () => {
  return (
    <section className="structure-section">
      <hr />
      <h4>Hardcoded HTML Visual List Layout</h4>
      <ul className="structure-list">
        <li>
          <div className="row-wrapper">
            <span className="structure-title heading">
              7th Indiana International Guitar Festival and Competition Guest
              Recital
            </span>
            <div className="edit-controls-wrapper">
              <a href="/">(add child)</a>
              <FontAwesomeIcon icon="pen" />
              <FontAwesomeIcon icon="trash" />
            </div>
          </div>
          <ul className="structure-list">
            <li>
              <div className="row-wrapper">
                <span className="structure-title">
                  ambience (00:03:23.33 - 00:11:29.79)
                </span>
                <div className="edit-controls-wrapper">
                  <a href="/">(add parent)</a>
                  <FontAwesomeIcon icon="pen" />
                  <FontAwesomeIcon icon="trash" />
                </div>
              </div>
            </li>
            <li>
              <div className="row-wrapper">
                <span className="structure-title">
                  Jose Antonio ... (00:11:29.79 - 00:12:53.50)
                </span>
                <div className="edit-controls-wrapper">
                  <a href="/">(add parent)</a>
                  <FontAwesomeIcon icon="pen" />
                  <FontAwesomeIcon icon="trash" />
                </div>
              </div>
            </li>
            <li>
              <div className="row-wrapper">
                <span className="structure-title heading">
                  Fernando Sor, Grand Sonata No. 1 in C major, Op. 22
                </span>
                <div className="edit-controls-wrapper">
                  <a href="/">(add child)</a>
                  <FontAwesomeIcon icon="pen" />
                  <FontAwesomeIcon icon="trash" />
                </div>
              </div>
              <ul className="structure-list">
                <li>
                  <div className="row-wrapper">
                    <span className="structure-title heading">
                      Sub-heading Label
                    </span>
                    <div className="edit-controls-wrapper">
                      <a href="/">(add child)</a>
                      <FontAwesomeIcon icon="pen" />
                      <FontAwesomeIcon icon="trash" />
                    </div>
                  </div>
                  <ul className="structure-list">
                    <li>
                      <div className="row-wrapper">
                        <span className="structure-title">
                          I. Allegro (00:04:45.55 - 00:11:29.79)
                        </span>
                        <div className="edit-controls-wrapper">
                          <a href="/">(add parent)</a>
                          <FontAwesomeIcon icon="pen" />
                          <FontAwesomeIcon icon="trash" />
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="row-wrapper">
                        <span className="structure-title">
                          II. Adagio (00:11:29.79 - 00:12:53.50)
                        </span>
                        <div className="edit-controls-wrapper">
                          <a href="/">(add parent)</a>
                          <FontAwesomeIcon icon="pen" />
                          <FontAwesomeIcon icon="trash" />
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="row-wrapper">
                        <span className="structure-title">
                          III. Menuetto: Allegro (00:12:53.50 - 00:18:31.90)
                        </span>
                        <div className="edit-controls-wrapper">
                          <a href="/">(add parent)</a>
                          <FontAwesomeIcon icon="pen" />
                          <FontAwesomeIcon icon="trash" />
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <div className="row-wrapper">
                <span className="structure-title heading">
                  Metallica - And Justice For All
                </span>
                <div className="edit-controls-wrapper">
                  <a href="/">(add child)</a>
                  <FontAwesomeIcon icon="pen" />
                  <FontAwesomeIcon icon="trash" />
                </div>
              </div>
              <ul className="structure-list">
                <li>
                  <div className="row-wrapper">
                    <span className="structure-title">
                      Blackened (00:00:00 - 00:05:29.19)
                    </span>
                    <div className="edit-controls-wrapper">
                      <a href="/">(add parent)</a>
                      <FontAwesomeIcon icon="pen" />
                      <FontAwesomeIcon icon="trash" />
                    </div>
                  </div>
                </li>
                <li>
                  <div className="row-wrapper">
                    <span className="structure-title">
                      Shortest Straw (00:11:29.79 - 00:16:53.50)
                    </span>
                    <div className="edit-controls-wrapper">
                      <a href="/">(add parent)</a>
                      <FontAwesomeIcon icon="pen" />
                      <FontAwesomeIcon icon="trash" />
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </section>
  );
};

export default HardCoded;
