import React, { Component } from "react";
import { Row, Col, Input, Container, Button } from "reactstrap";
import { connect } from 'react-redux'
import { ReactTinyLink } from "react-tiny-link";
import CreatePost from "./CreatePost"

const mapStateToProps = state => state

class NewPostMetaGrab extends Component {
  state = {
    link: "",
    showImage: false,
    urlMetaTags: [],
    openMainForm: false

  };

  render() {
    return (
      <>
        {!this.state.openMainForm &&
          <Col>
            <Container className="text-center">
              <Row>
                <Col>
                  {this.state.link === null &&
                    <h4 className="alert-url">Insert a valid url!</h4>
                  }
                  <Input
                    className="create-url"
                    type="url"
                    placeholder="Type an URL..."
                    value={this.state.link}
                    onChange={this.isUrlValid}
                  />
                </Col>
                {this.state.showImage && this.state.link &&
                  <Button onClick={() => this.handleMetaTag(this.state.link)} className="paste-button">Next</Button>}
              </Row>
            </Container>
            <Container className="text-center">
              {this.state.showImage && this.state.link &&
                <>
                  <h4 className="m-5">Preview</h4>
                  <div className="not-clickable" onclick="return false">
                    <ReactTinyLink
                      cardSize="small"
                      showGraphic={true}
                      maxLine={2}
                      minLine={1}
                      url={this.state.link}
                    />
                  </div>
                </>}
            </Container>
          </Col>}
        {this.state.openMainForm && (<CreatePost data={this.state.urlMetaTags} link={this.state.link} />)}
      </>);
  }

  componentDidMount = () => {
    if(!this.props.accessToken)
      this.props.history.push("/")
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ showImage: true });
  };

  isUrlValid = (e) => {
    let userInput = e.currentTarget.value
    let res = userInput.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    if (res == null) {
      this.setState({ link: null })
    }
    else {
      this.setState({
        link: e.currentTarget.value,
        showImage: true
      })
    }
  };

  handleMetaTag = async (url) => {
    // http://localhost:9000/api/metatag?url=https://www.youtube.com/watch?v=93p3LxR9xfM
    const response = await fetch(`http://localhost:9000/api/metatag?url=${url}`)
    if (response.ok) {
      const urlData = await response.json()
      console.log(urlData)
      this.setState({
        urlMetaTags: urlData.value,
        openMainForm: true
      })
    }
  };

}

export default connect(mapStateToProps)(NewPostMetaGrab);
