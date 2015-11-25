var ExamGenerator = React.createClass({
	buildNewQuestion: function () {
		return {
			'questionText': '',
			'choices': [
				this.buildNewChoice(1),
				this.buildNewChoice(2)
			],
			'correctAnswers': -1,
			'correctType': 'and'
		};
	},
	buildNewChoice: function (id) {
		return {
			'id': id,
			'choiceText': '',
		};
	},
	getInitialState: function () {
		return {
			'title': '',
			'hours': 1,
			'minutes': 30,
			'allotedTime': 90,
			'questions': [this.buildNewQuestion()]
		};
	},
	addQuestion: function () {
		this.setState({
			'questions': this.state.questions.concat([this.buildNewQuestion()])
		});
	},
	onAddChoice: function (questionIndex) {
		var questions = this.state.questions;
		questions[questionIndex].choices.push(this.buildNewChoice(questions[questionIndex].choices.length + 1));
		this.setState({'questions': questions});
	},
	onToggleChoice: function (questionIndex, choiceIndex) {
		var questions = this.state.questions;
		var choicesNodes = document.getElementsByName('choice' + questionIndex);
		
		var checkedChoices = [];

		for (var i = 0; i < choicesNodes.length; i++) {
			if (choicesNodes[i].checked) {
				checkedChoices.push(choicesNodes[i].dataset.choiceid);
			}
		}

		if (checkedChoices.length == 1) {
			questions[questionIndex].correctAnswers = checkedChoices[0];
		} else {
			questions[questionIndex].correctAnswers = checkedChoices;
		}

		this.setState({'questions': questions});
	},
	onChoiceTextChanged: function (questionIndex, choiceIndex, newValue) {
		var questions = this.state.questions;
		questions[questionIndex].choices[choiceIndex].choiceText = newValue;
		this.setState({'questions': questions});
	},
	onQuestionTextChanged: function (questionIndex, newValue) {
		var questions = this.state.questions;
		questions[questionIndex].questionText = newValue;
		this.setState({'questions': questions});
	},
	onRemoveQuestion: function (questionIndex) {
		if (this.state.questions.length > 1) {
			var questions = this.state.questions;
			questions.splice(questionIndex, 1);
			this.setState({questions: questions});
		}
	},
	onRemoveChoice: function (questionIndex, choiceIndex) {
		var question = this.state.questions[questionIndex];

		if (question.choices.length > 2) {
			question.choices.splice(choiceIndex, 1);
			var questions = this.state.questions;
			questions[questionIndex] = question;
			this.setState({questions: questions});
		}
	},
	onCorrectTypeChange: function (questionIndex, correctType) {
		alert('Question #' + questionIndex + " correctType: " + correctType);

		var questions = this.state.questions;
		var question = questions[questionIndex];
		
		question.correctType = correctType;
		this.setState({
			questions: questions
		});
	},
	handleTitleChange: function (e) {
		this.setState({'title': e.target.value});
	},
	handleHourChange: function (e) {
		var temp = parseInt(e.target.value);

		this.setState({
			'hours': temp,
			'allotedTime': this.state.minutes + (temp * 60)
		});
	},
	handleMinuteChange: function (e) {
		var temp = parseInt(e.target.value);

		this.setState({
			'minutes': temp,
			'allotedTime': temp + (this.state.hours * 60)
		});
	},
	jsonifyExam: function () {
		var errors = '';
		var flag = true;

		this.state.questions.forEach(function(question, i) {
			if (question.questionText === '') {
				errors += 'Question #' + (i + 1) + ' is empty.\n';
			} else {
				question.choices.forEach(function(choice, j) {
					if (choice.choiceText === '') {
						errors += 'Question #' + (i + 1) + ' choice #' + (j + 1) + ' is empty.\n';
						flag = false;
					}
				});

				if (question.correctAnswers === -1) {
					errors += 'Question #' + (i + 1) + ' has no correct answer(s).\n'
				} else if (flag &&
					question.correctAnswers.constructor === Array &&
					question.correctAnswers.length === question.choices.length) {
					errors += 'All of the choices in question #' + (i + 1) + ' are correct.\n'
				}
			}

			flag = true;
		});

		if (errors === '') {
			prompt('Here\'s your exam',JSON.stringify(this.state));
		} else {
			alert(errors);
		}
	},
	loadExam: function () {
		var jsonExam = prompt('Paste JSON Exam', '');
		
		try {
			var exam = JSON.parse(jsonExam);
			this.setState({
				title: exam.title,
				hours: exam.hours,
				minutes: exam.minutes,
				allotedTime: exam.allotedTime,
				questions: exam.questions,
				fromLoad: true
			});
		} catch (exception) {
			alert('You entered an invalid JSON');
		}
	},
	componentDidUpdate: function (prevProps, prevState) {
		if (this.state.fromLoad) {
			this.setState({ fromLoad: false });
			this.state.questions.forEach(function(question, index) {
				if (question.correctAnswers !== -1) {
					var choiceNodes = document.getElementsByName('choice' + index);

					if (question.correctAnswers.constructor === Array) {
						for (var i = 0; i < choiceNodes.length; i++) {
							if (question.correctAnswers.indexOf('' + choiceNodes[i].dataset.choiceid) !== -1) {
								choiceNodes[i].checked = true;
							}
						}
					} else {
						for (var i = 0; i < choiceNodes.length; i++) {
							if (choiceNodes[i].dataset.choiceid == question.correctAnswers) {
								choiceNodes[i].checked = true;
							}
						}
					}
				}
			});
		}
	},
	render: function () {
		var questions = this.state.questions.map(function (question, index) {
			return (
				<Question 
					key={index} 
					index={index} 
					src={question} 
					onRemoveQuestion={this.onRemoveQuestion}
					onRemoveChoice={this.onRemoveChoice}
					onQuestionTextChanged={this.onQuestionTextChanged}
					onChoiceTextChanged={this.onChoiceTextChanged}
					onToggleChoice={this.onToggleChoice}
					onCorrectTypeChange={this.onCorrectTypeChange}
					onAddChoice={this.onAddChoice} />
			);
		}, this);

		return (
			<div className="exam">
				<h1>Exam Generator</h1>
				<div className="exam-header">
					<span>Exam Title</span>
					<input type="text" value={this.state.title} onChange={this.handleTitleChange} />
				</div>
				<div className="exam-header">
					<span>Alloted Time</span>
					<div className="exam-header-time">
						<input type="number" value={this.state.hours} onChange={this.handleHourChange} />
						<span>hours</span>
						<input type="number" value={this.state.minutes} onChange={this.handleMinuteChange} />
						<span>minutes</span>
					</div>
				</div>

				<div className="exam-questions">
					{questions}
				</div>

				<button onClick={this.addQuestion}>Add a Question</button>
				<button onClick={this.jsonifyExam}>JSONify Exam</button>
				<button onClick={this.loadExam}>Load JSON Exam</button>
			</div>
		);
	}
});

var Question = React.createClass({
	removeQuestion: function () {
		this.props.onRemoveQuestion(this.props.index);
	},
	removeChoice: function (choiceIndex) {
		this.props.onRemoveChoice(this.props.index, choiceIndex);
	},
	addChoice: function () {
		this.props.onAddChoice(this.props.index);
	},
	handleTextChange: function (e) {
		this.props.onQuestionTextChanged(this.props.index, e.target.value);
	},
	handleToggleChoice: function (choiceIndex) {
		this.props.onToggleChoice(this.props.index, choiceIndex);
	},
	handleChoiceTextChange: function (choiceIndex, newValue) {
		this.props.onChoiceTextChanged(this.props.index, choiceIndex, newValue);
	},
	handleCorrectTypeChange: function (e) {
		this.props.onCorrectTypeChange(this.props.index, e.target.value);
	},
	render: function () {
		var choices = this.props.src.choices.map(function (choice, index) {
			return (
				<Choice 
					key={index} 
					index={index}
					src={choice}
					group={this.props.index}
					onRemoveChoice={this.removeChoice}
					onToggleChoice={this.handleToggleChoice}
					onChoiceTextChanged={this.handleChoiceTextChange} />
			);
		}, this);

		if (this.props.src.correctAnswers.constructor === Array &&
			this.props.src.correctAnswers.length) {
			var options = (
				<select onChange={this.handleCorrectTypeChange} defaultValue={this.props.src.correctType}>
					<option value="and">AND</option>
					<option value="or">OR</option>
				</select>
			);
		}

		return (
			<div className="exam-question">
				<span>
					<button onClick={this.removeQuestion}>x</button>
					Question #{this.props.index  + 1}
					{options}		
				</span>
				<textarea value={this.props.src.questionText} onChange={this.handleTextChange} />
				<div className="exam-question-choices">
					{choices}
					<button onClick={this.addChoice}>Add a Choice</button>
				</div>
			</div>
		);
	}
});

var Choice = React.createClass({
	removeChoice: function () {
		this.props.onRemoveChoice(this.props.index);
	},
	handleTextChange: function (e) {
		this.props.onChoiceTextChanged(this.props.index, e.target.value);
	},
	toggleChoice: function () {
		this.props.onToggleChoice(this.props.index);
	},
	render: function () {
		return (
			<div>
				<button onClick={this.removeChoice}>x</button>
				<input type="text" value={this.props.src.choiceText} onChange={this.handleTextChange} />
				<input type="checkbox" name={'choice' + this.props.group} data-choiceid={this.props.src.id} onChange={this.toggleChoice} />
				<span>Correct Answer</span>
			</div>
		);
	}
});

React.render(<ExamGenerator />, document.body);