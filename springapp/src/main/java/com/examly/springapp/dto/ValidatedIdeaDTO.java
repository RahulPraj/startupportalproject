package com.examly.springapp.dto;

public class ValidatedIdeaDTO {
    private String ideaTitle;
    private double averageScore;
    private String feedback;
    private double estimatedBudget;
    private String targetMarket;

    public ValidatedIdeaDTO() {}

    public ValidatedIdeaDTO(String ideaTitle, double averageScore, String feedback, double estimatedBudget, String targetMarket) {
        this.ideaTitle = ideaTitle;
        this.averageScore = averageScore;
        this.feedback = feedback;
        this.estimatedBudget = estimatedBudget;
        this.targetMarket = targetMarket;
    }

    public String getIdeaTitle() { return ideaTitle; }
    public void setIdeaTitle(String ideaTitle) { this.ideaTitle = ideaTitle; }

    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public double getEstimatedBudget() { return estimatedBudget; }
    public void setEstimatedBudget(double estimatedBudget) { this.estimatedBudget = estimatedBudget; }

    public String getTargetMarket() { return targetMarket; }
    public void setTargetMarket(String targetMarket) { this.targetMarket = targetMarket; }
}