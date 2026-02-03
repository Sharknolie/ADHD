package com.adhdhelper.mapper;

import com.adhdhelper.domain.Question;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface QuestionMapper {
    @Select("SELECT id, text FROM questions ORDER BY id ASC")
    List<Question> findAll();

    @Select("SELECT COUNT(*) FROM questions")
    int count();

    @Insert("INSERT INTO questions (text) VALUES (#{text})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Question question);

    @Delete("DELETE FROM questions WHERE id = #{id}")
    int delete(Long id);
}
