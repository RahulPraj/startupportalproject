package com.examly.springapp.repository;

import com.examly.springapp.model.Idea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IdeaRepository extends JpaRepository<Idea, Long> {
    // JpaRepository provides save, findAll, deleteById etc.
}
