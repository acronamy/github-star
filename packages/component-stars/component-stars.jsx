import * as React from "react";
import * as componentStarsStyle from "./component-stars.scss";

export class ComponentStars extends React.Component {
  render() {
    return (
      <div className="str-Stars">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path className="str-Stars_Icon" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
        </svg>
        <span aria-label={`${this.props.count} stars`} className="str-Stars_Text">
           <span aria-hidden>{this.props.count}</span>
        </span>
        <style>{componentStarsStyle}</style>
      </div>
    );
  }
}