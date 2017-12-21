import React, { Component } from 'react';
import StarRatingComponent from 'react-star-rating-component';

class App extends Component {
  state = {
    reviews: {}
  }

  componentDidMount() {
    // get our starting reviews
    // eslint-disable-next-line
    return fetch('http://scotch.box/wp-json/reviews/v1/get-reviews/' + post_id,
          {
              method: 'GET',
          }
      ).then(response =>
        response.json().then(data => ({
               data: data,
               status: response.status
            })
        ).then(res => {
           if (res.status == 200) {
               this.setState({reviews: res.data})
           }
    }))
  }

  addReview = (value) => {
    // eslint-disable-next-line
    const data = {user_id: user_id, post_id: post_id, review: value};
    // get our starting reviews
    return fetch('http://scotch.box/wp-json/reviews/v1/add-review',
          {
              method: 'POST',
              headers: {
                    'Content-Type': 'application/json'
              },
              body: JSON.stringify({data: data})
          }
      ).then(response =>
        response.json().then(data => ({
               data: data,
               status: response.status
            })
        ).then(res => {
           if (res.status == 200) {
               this.setState({reviews: res.data})
           }
    }))
  }

  render() {

    // prepare our reviews
    const reviews = this.state.reviews;
    let reviewArray = [];
    // set things up for our review average
    let reviewTotal = 0;
    for(const key in reviews) {
      reviewArray.push({name: reviews[key].name, review: reviews[key].review, image: reviews[key].image});
      reviewTotal += parseInt(reviews[key].review, 10);
    }

    const reviewAverage = reviewTotal / reviewArray.length;

    // check if our user is logged in
    let isLoggedIn = false;
    // eslint-disable-next-line
    if(user_id) {
      isLoggedIn = true;
    }

    // check if our user has a review
    let hasReview = false;
    // eslint-disable-next-line
    if(this.state.reviews[user_id]) {
      hasReview = true;
    }

    return (
      <div className="App">
          {
            !hasReview && isLoggedIn
              ?
                <div className='leave-review'>
                  <h4>Leave a review</h4>
                    <StarRatingComponent
                        name='rating' 
                        onStarClick={(value) => this.addReview(value)}
                    />
                </div>
              : 
                null
          }
          <hr/>
          <h4>Reviews of this Post</h4>
          {
            reviewArray.length
              ?
                <div>
                  <h6>Average Review</h6>
                  <StarRatingComponent
                      name='rating' 
                      value={reviewAverage}
                      editing={false}
                      renderStarIcon={(index, value) => {
                        return value >= index ? <i style={{fontStyle: 'normal'}}>&#9733;</i> : null;
                      }}
              renderStarIconHalf={() => <i style={{fontStyle: 'normal', overflow: 'hidden', width: 8}}>&#9733;</i>}
                      renderStarIconHalf={() => <div style={{overflow: 'hidden', width: 8}}><i style={{fontStyle: 'normal', color: 'rgb(255, 180, 0)'}}>&#9733;</i></div>}
                  />
                  <h6>User Reviews</h6>
                </div>
              :
                <p>No Reviews</p>
          }
          {reviewArray.map((review, index) => {
            return (
              <div className='review' key={'review_' + index}>
                <StarRatingComponent
                    name='rating' 
                    value={review.review}
                    editing={false}
                />
                <p style={{display: 'flex', alignItems: 'center'}}>
                  {review.image ? <span><img alt={"review from " + review.name} src={review.image}/>&nbsp;</span> : null}
                  {review.name}
                </p>
                <hr/>
              </div>
            )
          })}
      </div>
    );
  }
}

export default App;
