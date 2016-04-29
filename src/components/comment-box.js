import React from 'react';
import jQuery from 'jquery';

import Comment from './comment';
import CommentForm from './comment-form';
import CommentAvatarList from './comment-avatar-list';

export default class CommentBox extends React.Component {

  constructor() {
    super();

    this.state = {
      showComments: false,
      comments: []
    };
    {/*
      every time setState is called, the render function gets called again,
      so every time a prop uses a functionName.bind(this) it makes a new reference
      to functionName in the memory every time render is called,
      so we're depending on the garbage collector to get rid of the objects.

      Binding at the constructor level will enable to create only one memory reference to the objects
      and recreating at each render()

    */}
    this._deleteComment = this._deleteComment.bind(this);{/* binding to CommentBox*/}
    this._addComment = this._addComment.bind(this);
  }

  componentWillMount() {
    this._fetchComments();
  }

  render() {
    const comments = this._getComments();
    return(
      <div className="row comments-container">
        <div className="cell">
          <h2>Join The Discussion</h2>
          <div className="comment-box">
            <CommentForm addComment={this._addComment} />
            <CommentAvatarList avatars={this._getAvatars()} />

            {this._getPopularMessage(comments.length)}
            <h3 className="comment-count">{this._getCommentsTitle(comments.length)}</h3>
            <div className="comment-list">
              {comments}
            </div>
          </div>
        </div>
      </div>

    );
  }

  _getAvatars() {
    return this.state.comments.map(comment => comment.avatarUrl);
  }

  _getPopularMessage(commentCount) {
    const POPULAR_COUNT = 10;
    if (commentCount > POPULAR_COUNT) {
       return (
         <div>This post is getting really popular, dont miss out!</div>
       );
    }
  }

  _getComments() {
    return this.state.comments.map((comment) => {
      return <Comment
              {...comment /*spread operator to get all the properties from comment*/}
               onDelete={ this._deleteComment /*most performant way is to bind to this CommentBox context in the constructor above*/
                 /* (commentID) => this._deleteComment(commentID)
                    we invoke _deleteComment directly in an arrow function
                    that binds directly to this CommentBox context instead
                    instead of using .bind(this) method on it*/}
               key={comment.id} />
    });
  }

  _getCommentsTitle(commentCount) {
    if (commentCount === 0) {
      return 'No comments yet';
    } else if (commentCount === 1) {
      return '1 comment';
    } else {
      return `${commentCount} comments`;
    }
  }

  _addComment(commentAuthor, commentBody) {

    const comment = {
      id: this.state.comments.length + 1,
      author: commentAuthor,
      body: commentBody,
      avatarUrl: 'assets/images/avatars/avatar-default.png'
    };

    this.setState({
      comments: this.state.comments.concat([comment])
    });

  }

  _fetchComments() {
    jQuery.ajax({
      method: 'GET',
      url: 'comments.json',
      success: (comments) => {
        this.setState({ comments })
      }
    });
  }

  _deleteComment(commentID) {
    const comments = this.state.comments.filter(
      comment => comment.id !== commentID
    );

    this.setState({ comments });
  }
}
