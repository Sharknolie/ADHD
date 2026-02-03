package com.adhdhelper.service;

import com.adhdhelper.domain.Question;
import com.adhdhelper.mapper.QuestionMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionService {
    private final QuestionMapper questionMapper;

    public QuestionService(QuestionMapper questionMapper) {
        this.questionMapper = questionMapper;
    }

    public List<Question> list() {
        if (questionMapper.count() == 0) {
            seedDefaults();
        }
        return questionMapper.findAll();
    }

    public Question create(String text) {
        Question question = new Question();
        question.setText(text);
        questionMapper.insert(question);
        return question;
    }

    public void delete(Long id) {
        questionMapper.delete(id);
    }

    private void seedDefaults() {
        List<String> defaults = new ArrayList<>();
        defaults.add("Are you comfortable right now?");
        defaults.add("Did you drink water today?");
        defaults.add("Are you hungry?");
        defaults.add("Do you need a restroom break?");
        defaults.add("Is the lighting comfortable?");
        defaults.add("Is your environment quiet enough?");

        for (String text : defaults) {
            Question q = new Question();
            q.setText(text);
            questionMapper.insert(q);
        }
    }
}
