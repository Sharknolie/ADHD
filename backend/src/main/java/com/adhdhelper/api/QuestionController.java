package com.adhdhelper.api;

import com.adhdhelper.api.dto.CreateQuestionRequest;
import com.adhdhelper.domain.Question;
import com.adhdhelper.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {
    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public List<Question> list() {
        return questionService.list();
    }

    @PostMapping
    public Question create(@Valid @RequestBody CreateQuestionRequest request) {
        return questionService.create(request.getText());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        questionService.delete(id);
    }
}
