import * as React from "react";
import * as componentListStyle from "./component-list.scss";
import { store } from "../app-state/store";
import { ADD_REPO } from "../app-state/actions/constants";
import { ComponentDate } from "../component-date/component-date";
import { ComponentStars } from "../component-stars/component-stars";

export class ComponentList extends React.Component {
  constructor () {
    super();
    this.state = {
      repoList: []
    }
  }
  get languagFromPath() {
    return location.pathname.split('/').filter(Boolean)[0];
  }
  /**
   * Requests, formats and returns a list of Github repos
   * @returns promise<JSON[]>
   */
  async getStarData(language, count = 3) {
    const { protocol, host } = location;
    const ENDPOINT = `api/${language}`;
    const payload = await fetch(`${protocol}//${host}/${ENDPOINT}/${count}`);
    const json = await payload.json();
    for (const repo of json.items) {
      store.dispatch({
        type: ADD_REPO,
        payload: {
          name: repo.name,
          description: repo.description,
          stars: repo.stargazers_count,
          created: repo.created_at,
          url: repo.html_url
        }
      });
    }
    return store.getState().repoList;
  }
  /** 
   * React lifecycle before render
  */
  async componentWillMount() {
    const count = 3;
    const language = this.languagFromPath;
    this.setState({
      repoList: await this.getStarData(language, count)
    });
  }
  render() {
    return (
      <div className="str-List">
        <ol className="str-List_List">
          {this.state.repoList.map((repo, index) => {
            return (
              <li className="str-List_Item" key={index}>
                <a target="_blank" href={repo.url}>{repo.name}</a>
                <p className='str-List_Description'>{repo.description}</p>
                <div className="str-List_Footer">
                  <ComponentDate prefix="Created: " date={repo.created}/>
                  <ComponentStars count={repo.stars}/>
                </div>
              </li>
            )
          })}
        </ol>
        <style>{componentListStyle}</style>
      </div>
    );
  }
}