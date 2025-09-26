package com.examly.springapp.service;

import com.examly.springapp.dto.ValidatedIdeaDTO;
import com.examly.springapp.model.Idea;
import com.examly.springapp.repository.IdeaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class IdeaValidationService {

    @Autowired
    private IdeaRepository ideaRepository;

    // Save a new idea
    public Idea saveIdea(Idea idea) {
        return ideaRepository.save(idea);
    }

    // Get all ideas
    public List<Idea> getAllIdeas() {
        return ideaRepository.findAll();
    }

    // Delete idea by ID
    public void deleteIdea(Long id) {
        ideaRepository.deleteById(id);
    }

    // Compute a "validated" view for ideas with deterministic averageScore and feedback
    // This is a simplified, deterministic approach for the validation endpoint.
    public List<ValidatedIdeaDTO> getValidatedIdeas() {
        List<Idea> ideas = ideaRepository.findAll();

        List<ValidatedIdeaDTO> dtos = ideas.stream().map(idea -> {
            // Deterministic pseudo scoring:
            // base score from estimatedBudget (smaller budgets -> higher score)
            double budgetScore = Math.max(0, 5 - (idea.getEstimatedBudget() / 50000.0)); // scale
            // description length contributes
            double descScore = Math.min(2.0, idea.getDescription() == null ? 0 :
                    Math.min(2.0, (idea.getDescription().length() / 200.0)));
            // target market heuristics (if specific words)
            double marketScore = 0.0;
            String market = idea.getTargetMarket() == null ? "" : idea.getTargetMarket().toLowerCase();
            if (market.contains("online") || market.contains("saas") || market.contains("retail") || market.contains("small")) {
                marketScore = 1.0;
            }

            double avg = Math.round(Math.min(5.0, Math.max(0.0, budgetScore + descScore + marketScore)) * 10.0) / 10.0;

            // short feedback based on avg
            String feedback;
            if (avg >= 4.0) {
                feedback = "Strong potential — clearly defined market and feasible budget.";
            } else if (avg >= 3.0) {
                feedback = "Promising — refine positioning and budget plan.";
            } else if (avg >= 2.0) {
                feedback = "Needs work — clarify market and reduce budget or phase execution.";
            } else {
                feedback = "High risk — revisit the idea and assumptions.";
            }

            return new ValidatedIdeaDTO(
                    idea.getIdeaTitle(),
                    avg,
                    feedback,
                    idea.getEstimatedBudget(),
                    idea.getTargetMarket()
            );
        }).collect(Collectors.toList());

        // Sort by averageScore desc (best validated first)
        dtos.sort(Comparator.comparingDouble(ValidatedIdeaDTO::getAverageScore).reversed());

        return dtos;
    }
}