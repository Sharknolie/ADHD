package com.adhdhelper.service;

import com.adhdhelper.domain.Task;
import com.adhdhelper.mapper.TaskMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {
    private final TaskMapper taskMapper;
    private final CoinService coinService;

    public TaskService(TaskMapper taskMapper, CoinService coinService) {
        this.taskMapper = taskMapper;
        this.coinService = coinService;
    }

    public List<Task> list(String category) {
        if (category == null || category.isBlank() || "all".equalsIgnoreCase(category)) {
            return taskMapper.findAll();
        }
        return taskMapper.findByCategory(category);
    }

    public Task create(Task task) {
        task.setCompleted(false);
        taskMapper.insert(task);
        return task;
    }

    @Transactional
    public int complete(Long id) {
        Task task = taskMapper.findById(id);
        if (task == null) {
            throw new IllegalArgumentException("Task not found");
        }
        int coins = task.getCoins() == null ? 0 : task.getCoins();
        int newCoins = coinService.adjustCoins(coins);
        taskMapper.delete(id);
        return newCoins;
    }

    public void delete(Long id) {
        taskMapper.delete(id);
    }
}
