package com.adhdhelper.mapper;

import com.adhdhelper.domain.Task;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TaskMapper {
    @Select("SELECT id, content, category, energy, coins, completed, created_at FROM tasks ORDER BY created_at DESC")
    List<Task> findAll();

    @Select("SELECT id, content, category, energy, coins, completed, created_at FROM tasks WHERE category = #{category} ORDER BY created_at DESC")
    List<Task> findByCategory(String category);

    @Select("SELECT id, content, category, energy, coins, completed, created_at FROM tasks WHERE id = #{id}")
    Task findById(Long id);

    @Insert("INSERT INTO tasks (content, category, energy, coins, completed) VALUES (#{content}, #{category}, #{energy}, #{coins}, #{completed})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Task task);

    @Delete("DELETE FROM tasks WHERE id = #{id}")
    int delete(Long id);
}
