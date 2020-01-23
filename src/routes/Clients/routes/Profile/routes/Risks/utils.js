const isQuestionDisabled = (currentQuestionId, formValues, disabledQuestions) => {
  let isDisabled = false;

  disabledQuestions.forEach(({
    answerId,
    questionId,
    disabledQuestions: disabledQuestionsIds,
  }) => {
    if (isDisabled) return;

    const questionName = `questionId-${questionId}`;
    const formValue = (formValues[questionName] && JSON.parse(formValues[questionName])) || {};

    const answer = answerId || null;
    const formAnswer = formValue.answerId || null;

    isDisabled = formAnswer === answer && disabledQuestionsIds.includes(currentQuestionId);
  });

  return isDisabled;
};

export default isQuestionDisabled;
