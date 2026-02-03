package com.adhdhelper.api;

import com.adhdhelper.api.dto.CoinResponse;
import com.adhdhelper.api.dto.CreateTaskRequest;
import com.adhdhelper.domain.Task;
import com.adhdhelper.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> list(@RequestParam(name = "category", required = false) String category) {
        return taskService.list(category);
    }

    @PostMapping
    public Task create(@Valid @RequestBody CreateTaskRequest request) {
        Task task = new Task();
        task.setContent(request.getContent());
        task.setCategory(request.getCategory());
        task.setEnergy(request.getEnergy());
        task.setCoins(request.getCoins());
        return taskService.create(task);
    }

    @PostMapping("/{id}/complete")
    public CoinResponse complete(@PathVariable("id") Long id) {
        int coins = taskService.complete(id);
        return new CoinResponse(coins);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        taskService.delete(id);
    }
}
