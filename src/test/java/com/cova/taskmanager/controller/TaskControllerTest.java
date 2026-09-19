package com.cova.taskmanager.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TaskControllerTest {

    private static final Pattern ACCESS_TOKEN_PATTERN =
            Pattern.compile("\"accessToken\"\\s*:\\s*\"([^\"]+)\"");
    private static final Pattern TASK_ID_PATTERN =
            Pattern.compile("\"id\"\\s*:\\s*(\\d+)");

    @Autowired
    private MockMvc mockMvc;

    @Test
    void createTask_authenticatedUser_success() throws Exception {
        String token = registerAndLogin(uniqueEmail(), "password123");

        mockMvc.perform(post("/api/tasks")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Finish recruitment test",
                                  "description": "Complete backend",
                                  "status": "TODO"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(notNullValue()))
                .andExpect(jsonPath("$.title").value("Finish recruitment test"))
                .andExpect(jsonPath("$.description").value("Complete backend"))
                .andExpect(jsonPath("$.status").value("TODO"))
                .andExpect(jsonPath("$.createdAt").value(notNullValue()))
                .andExpect(jsonPath("$.updatedAt").value(notNullValue()));
    }

    @Test
    void listTasks_returnsOnlyAuthenticatedUserTasks() throws Exception {
        String user1 = uniqueEmail();
        String user2 = uniqueEmail();
        String token1 = registerAndLogin(user1, "password123");
        String token2 = registerAndLogin(user2, "password123");

        createTask(token1, taskJson("User1 task", "desc", "TODO"));

        mockMvc.perform(get("/api/tasks")
                        .header("Authorization", "Bearer " + token2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        mockMvc.perform(get("/api/tasks")
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("User1 task"));
    }

    @Test
    void updateTask_ownTask_success() throws Exception {
        String token = registerAndLogin(uniqueEmail(), "password123");
        Long taskId = createTask(token, taskJson("Original", "desc", "TODO"));

        mockMvc.perform(put("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Updated title",
                                  "description": "Updated description",
                                  "status": "IN_PROGRESS"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(taskId.intValue()))
                .andExpect(jsonPath("$.title").value("Updated title"))
                .andExpect(jsonPath("$.description").value("Updated description"))
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }

    @Test
    void updateTask_otherUsersTask_returnsNotFound() throws Exception {
        String token1 = registerAndLogin(uniqueEmail(), "password123");
        String token2 = registerAndLogin(uniqueEmail(), "password123");
        Long taskId = createTask(token1, taskJson("Private task", "desc", "TODO"));

        mockMvc.perform(put("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + token2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(taskJson("Hack", "hack", "DONE")))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Task not found"));
    }

    @Test
    void deleteTask_ownTask_success() throws Exception {
        String token = registerAndLogin(uniqueEmail(), "password123");
        Long taskId = createTask(token, taskJson("To delete", "desc", "TODO"));

        mockMvc.perform(delete("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/tasks")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void deleteTask_otherUsersTask_returnsNotFound() throws Exception {
        String token1 = registerAndLogin(uniqueEmail(), "password123");
        String token2 = registerAndLogin(uniqueEmail(), "password123");
        Long taskId = createTask(token1, taskJson("Protected", "desc", "TODO"));

        mockMvc.perform(delete("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + token2))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Task not found"));
    }

    @Test
    void listTasks_filterByStatus() throws Exception {
        String token = registerAndLogin(uniqueEmail(), "password123");
        createTask(token, taskJson("Todo task", "desc", "TODO"));
        createTask(token, taskJson("Done task", "desc", "DONE"));

        mockMvc.perform(get("/api/tasks")
                        .param("status", "TODO")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].status").value("TODO"));
    }

    @Test
    void createTask_blankTitle_returnsBadRequest() throws Exception {
        String token = registerAndLogin(uniqueEmail(), "password123");

        mockMvc.perform(post("/api/tasks")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "   ",
                                  "description": "desc"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.fieldErrors.title").value(is("Title is required")));
    }

    @Test
    void listTasks_invalidStatus_returnsBadRequest() throws Exception {
        String token = registerAndLogin(uniqueEmail(), "password123");

        mockMvc.perform(get("/api/tasks")
                        .param("status", "INVALID")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid status value"));
    }

    private String uniqueEmail() {
        return "task-user-" + UUID.randomUUID() + "@example.com";
    }

    private String registerAndLogin(String email, String password) throws Exception {
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(authJson(email, password)));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(authJson(email, password)))
                .andExpect(status().isOk())
                .andReturn();

        return extractAccessToken(loginResult.getResponse().getContentAsString());
    }

    private Long createTask(String token, String body) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/tasks")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn();
        return extractTaskId(result.getResponse().getContentAsString());
    }

    private static String taskJson(String title, String description, String status) {
        return """
                {
                  "title": "%s",
                  "description": "%s",
                  "status": "%s"
                }
                """.formatted(title, description, status);
    }

    private static String authJson(String email, String password) {
        return "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
    }

    private static String extractAccessToken(String responseBody) {
        Matcher matcher = ACCESS_TOKEN_PATTERN.matcher(responseBody);
        if (!matcher.find()) {
            throw new IllegalStateException("accessToken not found in response");
        }
        return matcher.group(1);
    }

    private static Long extractTaskId(String responseBody) {
        Matcher matcher = TASK_ID_PATTERN.matcher(responseBody);
        if (!matcher.find()) {
            throw new IllegalStateException("task id not found in response");
        }
        return Long.parseLong(matcher.group(1));
    }
}
