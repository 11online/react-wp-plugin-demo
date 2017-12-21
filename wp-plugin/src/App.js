import React, { Component } from 'react';
import StarRatingComponent from 'react-star-rating-component';

class App extends Component {
  state = {
    reviews: {}
  }

  componentDidMount() {
    // get our starting reviews
    return fetch(
     'http://scotch.box/wp-json/reviews/v1/get-reviews/1',
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

  render() {

    // prepare our reviews
    const reviews = this.state.reviews;
    let reviewArray = [];
    for(const key in reviews) {
      reviewArray.push({name: key, review: reviews[key].review, image: reviews[key].image});
    }

    return (
      <div className="App">
          {reviewArray.map((review, index) => {
            return (
              <div className='review' key={'review_' + index}>
                <StarRatingComponent
                    name='rating' 
                    value={review.review} /* number of selected icon (`0` - none, `1` - first) */
                    starCount={5} /* number of icons in rating, default `5` */
                    editing={false} /* is component available for editing, default `true` */
                />
                <p style={{display: 'flex', alignItems: 'center'}}>
                  {review.image ? <span><img alt={"review from " + review.name} src={review.image}/>&nbsp;</span> : null}
                  {review.name}
                </p>
              </div>
            )
          })}
      </div>
    );
  }
}

export default App;
