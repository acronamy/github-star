import * as React from "react";
import * as componentDateStyle from "./component-date.scss";

export class ComponentDate extends React.Component {
  intlDateFotmat(date, iso = 'en-GB') {
    if (typeof date === "string" && date.includes("T")) {
      date = date.split('T')[0].split('-').map(n => parseInt(n));
      date[1] = date[1] - 1; // corect to 0 offset month
    }

    console.log("D",date)
    const formatOptions = {
      day: 'numeric',
      year: 'numeric',
      month: 'long'
    }
    try {
      return new Intl.DateTimeFormat(iso, formatOptions).format(new Date(...date));
    }
    catch (err) {
      return "";
    }
  }
  render() {
    return (
      <div className="str-Date">
        <span className='str-Date_Text'>
          {this.props.prefix} {this.intlDateFotmat(this.props.date)}
        </span>
        <style>{componentDateStyle}</style>
      </div>
    );
  }
}