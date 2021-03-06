var Choice = React.createClass({displayName: "Choice",
	handleTextChange: function (e) {
		alert(e.target.value);
		this.props.onChoiceTextChanged();
	},
	toggleChoice: function (e) {
		alert(e.target.checked);
		this.props.onToggleChoice();
	},
	render: function () {
		return (
			React.createElement("div", null, 
				React.createElement("input", {type: "text", value: this.props.src.choiceText, onChange: this.handleTextChange}), 
				React.createElement("input", {type: "checkbox", onChange: this.toggleChoice, checked: this.props.src.isCorrect}), 
				React.createElement("span", null, "Correct Answer")
			)
		);
	}
});

var Question = React.createClass({displayName: "Question",
	addChoice: function () {
		alert(typeof this.props.onAddChoice);
		this.props.onAddChoice(this.props.index);
	},
	handleTextChange: function (e) {
		this.props.onQuestionTextChanged(this.props.index, e.target.value);
	},
	handleToggleChoice: function () {

	},
	handleChoiceTextChange: function () {

	},
	render: function () {
		var _this = this;

		var choices = this.props.src.choices.map(function (choice, index) {
			return (
				React.createElement(Choice, {
					key: index, 
					src: choice, 
					onToggleChoice: _this.handleToggleChoice, 
					onChoiceTextChanged: _this.handeChoiceTextChange})
			);
		});

		return (
			React.createElement("div", {className: "exam-question"}, 
				React.createElement("span", null, "Question ", this.props.src.id), 
				React.createElement("textarea", {value: this.props.src.questionText, onChange: this.handleTextChange}), 
				React.createElement("div", {className: "exam-question-choices"}, 
					choices, 
					React.createElement("button", {onClick: this.addChoice}, "Add a Choice")
				)
			)
		);
	}
});

var Exam = React.createClass({displayName: "Exam",
	buildNewQuestion: function () {
		return {
			'questionText': '',
			'choices': [
				{
					'choiceText': '',
					'isCorrect': false
				},
				{
					'choiceText': '',
					'isCorrect': false
				}
			]
		};
	},
	buildNewChoice: function () {
		return {
			'choiceText': '',
			'isCorrect': false
		};
	},
	getInitialState: function () {
		return {
			'title': '',
			'allotedTime': 90,
			'questions': [this.buildNewQuestion()]
		};
	},
	addQuestion: function () {
		var questions = this.state.questions;
		questions.push(this.buildNewQuestion());
		this.setState({'questions': questions});
	},
	onAddChoice: function (questionIndex) {
		var questions = this.state.questions;
		questions[questionIndex].choices.push(this.buildNewChoice());
		this.setState({'questions': questions});
	},
	onToggleChoice: function (questionIndex, choiceIndex) {

	},
	onChoiceTextChanged: function (questionIndex, choiceIndex, newValue) {

	},
	onQuestionTextChanged: function (questionIndex, newValue) {
		var questions = this.state.questions;
		questions[questionIndex].questionText = newValue;
		this.setState({'questions': questions});
	},
	jsonifyExam: function () {
		alert(JSON.stringify(this.state.questions));
	},
	render: function () {
		var _this = this;
		var questions = this.state.questions.map(function (question, index) {
			return (
				React.createElement(Question, {
					key: index, 
					index: index, 
					src: question, 
					onQuestionTextChanged: _this.onQuestionTextChanged, 
					onChoiceTextChanged: _this.onChoiceTextChanged, 
					onToggleChoice: _this.onToggleChoice, 
					onAddChoice: _this.onAddChoice})
			);
		});

		return (
			React.createElement("div", {className: "exam"}, 
				React.createElement("div", {className: "exam-header"}, 
					React.createElement("span", null, "Exam Title"), 
					React.createElement("input", {type: "text"})
				), 
				React.createElement("div", {className: "exam-header"}, 
					React.createElement("span", null, "Alloted Time"), 
					React.createElement("input", {type: "text"})
				), 
				React.createElement("div", {className: "exam-questions"}, 
					questions
				), 
				React.createElement("button", {onClick: this.addQuestion}, "Add a Question"), 
				React.createElement("button", {onClick: this.jsonifyExam}, "JSONify Exam")
			)
		);
	}
});

React.render(React.createElement(Exam, null), document.body);