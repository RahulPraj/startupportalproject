package com.examly.springapp;

import com.examly.springapp.controller.IdeaController;
import com.examly.springapp.dto.ValidatedIdeaDTO;
import com.examly.springapp.model.Idea;
import com.examly.springapp.service.IdeaValidationService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(IdeaController.class)
@Import(IdeaApplicationTests.TestSecurityConfig.class)  // Import custom security config for test
public class IdeaApplicationTests {

    @TestConfiguration
    static class TestSecurityConfig {
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.csrf().disable()
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IdeaValidationService ideaValidationService;

    private ObjectMapper mapper = new ObjectMapper();

    private Idea idea1, idea2;
    private ValidatedIdeaDTO validated1, validated2;

    @BeforeEach
    void setup() {
        idea1 = new Idea("Idea One", "Description One", "Online Market", 10000);
        idea1.setId(1L);

        idea2 = new Idea("Idea Two", "Description Two", "Retail Market", 50000);
        idea2.setId(2L);

        validated1 = new ValidatedIdeaDTO("Idea One", 4.5,
                "Strong potential — clearly defined market and feasible budget.",
                10000, "Online Market");

        validated2 = new ValidatedIdeaDTO("Idea Two", 2.7,
                "Needs work — clarify market and reduce budget or phase execution.",
                50000, "Retail Market");
    }

    @Test
    void testIdeaModel() {
        Idea idea = new Idea();
        idea.setIdeaTitle("Test");
        idea.setDescription("Desc");
        idea.setTargetMarket("Market");
        idea.setEstimatedBudget(1234);
        idea.setId(10L);

        assertEquals("Test", idea.getIdeaTitle());
        assertEquals("Desc", idea.getDescription());
        assertEquals("Market", idea.getTargetMarket());
        assertEquals(1234, idea.getEstimatedBudget());
        assertEquals(10L, idea.getId());
    }

    @Test
    void testSaveIdeaService() {
        Mockito.when(ideaValidationService.saveIdea(Mockito.any(Idea.class))).thenReturn(idea1);
        Idea saved = ideaValidationService.saveIdea(idea1);
        assertNotNull(saved);
        assertEquals("Idea One", saved.getIdeaTitle());
    }

    @Test
    void testGetAllIdeasService() {
        List<Idea> ideas = Arrays.asList(idea1, idea2);
        Mockito.when(ideaValidationService.getAllIdeas()).thenReturn(ideas);
        List<Idea> result = ideaValidationService.getAllIdeas();
        assertEquals(2, result.size());
        assertEquals("Idea Two", result.get(1).getIdeaTitle());
    }

    @Test
    void testDeleteIdeaService() {
        Mockito.doNothing().when(ideaValidationService).deleteIdea(1L);
        ideaValidationService.deleteIdea(1L);
        Mockito.verify(ideaValidationService, Mockito.times(1)).deleteIdea(1L);
    }

    @Test
    void testGetValidatedIdeasService() {
        List<ValidatedIdeaDTO> dtos = Arrays.asList(validated1, validated2);
        Mockito.when(ideaValidationService.getValidatedIdeas()).thenReturn(dtos);
        List<ValidatedIdeaDTO> result = ideaValidationService.getValidatedIdeas();
        assertEquals(2, result.size());
        assertEquals(4.5, result.get(0).getAverageScore());
    }

    @Test
    void testGetAllIdeasEndpoint() throws Exception {
        List<Idea> ideas = Arrays.asList(idea1, idea2);
        Mockito.when(ideaValidationService.getAllIdeas()).thenReturn(ideas);

        mockMvc.perform(get("/api/ideas"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].ideaTitle", is("Idea One")))
            .andExpect(jsonPath("$[1].estimatedBudget", is(50000.0)));
    }

    @Test
    void testAddIdeaEndpoint() throws Exception {
        Idea newIdea = new Idea("New Idea", "New Desc", "New Market", 1234);
        Idea savedIdea = new Idea("New Idea", "New Desc", "New Market", 1234);
        savedIdea.setId(5L);

        Mockito.when(ideaValidationService.saveIdea(Mockito.any(Idea.class))).thenReturn(savedIdea);

        mockMvc.perform(post("/api/ideas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(newIdea)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id", is(5)))
            .andExpect(jsonPath("$.ideaTitle", is("New Idea")));
    }

    @Test
    void testDeleteIdeaEndpoint() throws Exception {
        Mockito.doNothing().when(ideaValidationService).deleteIdea(1L);

        mockMvc.perform(delete("/api/ideas/1"))
            .andExpect(status().isOk());

        Mockito.verify(ideaValidationService, Mockito.times(1)).deleteIdea(1L);
    }

    @Test
    void testGetValidatedIdeasEndpoint() throws Exception {
        List<ValidatedIdeaDTO> dtos = Arrays.asList(validated1, validated2);
        Mockito.when(ideaValidationService.getValidatedIdeas()).thenReturn(dtos);

        mockMvc.perform(get("/api/ideas/validated"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].averageScore", is(4.5)));
    }
    @Test
void testGetAllIdeasEndpointEmptyList() throws Exception {
    Mockito.when(ideaValidationService.getAllIdeas()).thenReturn(Arrays.asList());

    mockMvc.perform(get("/api/ideas"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(0)));
}

}
