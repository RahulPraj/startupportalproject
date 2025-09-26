package com.examly.springapp.model;

import javax.persistence.*;

@Entity
public class Idea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ideaTitle;
    @Column(length = 2000)
    private String description;
    private String targetMarket;
    private double estimatedBudget;

    public Idea() { }

    public Idea(String ideaTitle, String description, String targetMarket, double estimatedBudget) {
        this.ideaTitle = ideaTitle;
        this.description = description;
        this.targetMarket = targetMarket;
        this.estimatedBudget = estimatedBudget;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIdeaTitle() { return ideaTitle; }
    public void setIdeaTitle(String ideaTitle) { this.ideaTitle = ideaTitle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTargetMarket() { return targetMarket; }
    public void setTargetMarket(String targetMarket) { this.targetMarket = targetMarket; }

    public double getEstimatedBudget() { return estimatedBudget; }
    public void setEstimatedBudget(double estimatedBudget) { this.estimatedBudget = estimatedBudget; }
}