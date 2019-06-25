import * as React from "react";
import * as ReactDOM from "react-dom";
import * as appStyle from "./app.scss";
import {previousRelativeMonthDay} from "../app-server/utils/time-utils";
import { ComponentTitle } from "../component-title/component-title";
import { ComponentList } from "../component-list/component-list";
import { ComponentDate } from "../component-date/component-date";

class App extends React.Component {
  static getMonthStartRange () {
    const now = new Date();
    const [year, month, day] = [now.getFullYear(), now.getMonth(), now.getDate()];
    const lastMonthsDay = previousRelativeMonthDay({
      year,
      month,
      day
    });
    return [year, month - 1, lastMonthsDay]
  }
  render() {
    return (
      <div className="str">
        <div className='str-Panel'>
          {this.props.children}
        </div>
        <style>{appStyle}</style>
      </div>
    );
  }
}

ReactDOM.render(
  <App>
    <ComponentTitle>
      <ComponentDate prefix='Repos created since' date={App.getMonthStartRange()}/>
    </ComponentTitle>
    <ComponentList/>
  </App>,
document.getElementById("root"));
