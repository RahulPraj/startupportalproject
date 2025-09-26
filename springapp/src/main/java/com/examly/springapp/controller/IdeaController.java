package com.examly.springapp.controller;

import com.examly.springapp.dto.ValidatedIdeaDTO;
import com.examly.springapp.model.Idea;
import com.examly.springapp.service.IdeaValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ideas")
public class IdeaController {

    @Autowired
    private IdeaValidationService ideaValidationService;

    // POST /api/ideas -> add idea
    @PostMapping
    public ResponseEntity<Idea> addIdea(@RequestBody Idea idea) {
        Idea saved = ideaValidationService.saveIdea(idea);
        return ResponseEntity.ok(saved);
    }

    // GET /api/ideas -> get all ideas
    @GetMapping
    public ResponseEntity<List<Idea>> getAllIdeas() {
        return ResponseEntity.ok(ideaValidationService.getAllIdeas());
    }

    // GET /api/ideas/validated -> get validated ideas (with scores and feedback)
    @GetMapping("/validated")
    public ResponseEntity<List<ValidatedIdeaDTO>> getValidatedIdeas() {
        return ResponseEntity.ok(ideaValidationService.getValidatedIdeas());
    }

    // DELETE /api/ideas/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIdea(@PathVariable Long id) {
        ideaValidationService.deleteIdea(id);
        return ResponseEntity.ok().build();
    }
}