import React from "react";

const InfoCard = (props) => {
  return (
    <div
      className="app-card"
      onClick={() => {
        props.handleChange(props.id);
      }}
    >
      <h3 className="app-card-title">{props.title}</h3>
      <p className="app-card-subtitle">{props.subtitle}</p>
    </div>
  );
};

export default InfoCard;

// class InfoCard extends React.PureComponent {
//   constructor(props) {
//     super(props);
//   }

//   componentDidUpdate(prevProps, prevState) {
//     if (prevProps !== this.props) {
//       console.log("state changed", prevProps, this.props);
//     }
//   }

//   componentWillUnmount() {
//     // Cleanup tasks before the component is unmounted
//     console.log('Component will unmount');
//     // For example, remove event listeners, cancel ongoing tasks, etc.
//   }

//   render = () => {
//     return (
//       <div
//         className="card"
//         onClick={() => {
//           this.props.handleChange(this.props.id);
//         }}
//       >
//         <h3 className="title">{this.props.title}</h3>
//         <p className="sub-title">{this.props.subtitle}</p>
//       </div>
//     );
//   };
// }
