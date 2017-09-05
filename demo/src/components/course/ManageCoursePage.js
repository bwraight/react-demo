import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';
import CourseForm from './CourseForm';

class ManageCoursePage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      course: Object.assign({}, this.props.course),
      errors: {}
    };

    this.updateCourseState = this.updateCourseState.bind(this);
    this.saveCourse = this.saveCourse.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.course.id !== nextProps.course.id) {
      this.setState({course: Object.assign({}, nextProps.course)});
    }
  }

  updateCourseState(event) {
    const field = event.target.name;
    let course = Object.assign({}, this.state.course);
    course[field] = event.target.value;
    return this.setState({course: course});
  }

  //redux state resetting, when page not immediately redirected.
  //redirect function call, doesn't help, needs to be called inline.
  //thunk promise not holding up page load.
  saveCourse(event) {
    event.preventDefault;
    this.props.actions.saveCourse(this.state.course)
      .then(this.context.router.push('/courses'));
  }

  redirect() {
    this.context.router.push('/courses');
  }

  render() {
    return (
      <CourseForm
        course={this.state.course}
        allAuthors={this.props.authors}
        errors={this.state.errors}
        onChange={this.updateCourseState}
        onSave={this.saveCourse}
      />
    );
  }
}

function getCourseById(courses, courseId) {
  let course = courses.filter(course => course.id == courseId);
  if (course.length) {
    return course[0];
  }
  return null;
}

function mapStateToProps(state, ownProps) {

  const courseId = ownProps.params.id;

  let course = {
    id: '',
    title: '',
    watchHref: '',
    authorId: '',
    length: '',
    category: ''
  };

  if (courseId && state.courses.length > 0) {
    course = getCourseById(state.courses, courseId);
  }

  const convertAuthorsForDropDown = state.authors.map(author => {
    return {
      value: author.id,
      text: author.firstName + ' ' + author.lastName
    };
  });

  return {
    course: course,
    authors: convertAuthorsForDropDown
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(courseActions, dispatch)
  };
}

ManageCoursePage.contextTypes = {
  router: PropTypes.object
};

ManageCoursePage.propTypes = {
  course: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
