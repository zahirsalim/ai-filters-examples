'use strict';

const e = React.createElement;

class ExampleVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { exampleUrl: "https://files.vectorly.io/demo/sydney/360p/sydney-360p.mp4", id: "my-video" };
  }

  render() {
    return (
        <div>
          <video className="video-container video-container-overlay" autoPlay={true} muted={true}>
            <source src={ this.state.exampleUrl} id={this.state.id} type="video/mp4" />
          </video>
        </div>
    );
  }
}

const domContainer = document.querySelector('#exampleVideoContainer');
ReactDOM.render(e(ExampleVideo), domContainer);