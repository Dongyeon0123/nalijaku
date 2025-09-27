
package com.nallijaku.backend.service;

import com.nallijaku.backend.entity.User;
import com.nallijaku.backend.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TestServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TestService testService;

    @Test
    @DisplayName("사용자 수 조회 테스트")
    void getUserCount() {
        // given
        when(userRepository.count()).thenReturn(5L);

        // when
        long userCount = testService.getUserCount();

        // then
        assertEquals(5L, userCount);
    }

    @Test
    @DisplayName("관리자 사용자 조회 테스트")
    void getAdminUser() {
        // given
        User admin = new User();
        admin.setUsername("admin");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(admin));

        // when
        Optional<User> adminUser = testService.getAdminUser();

        // then
        assertTrue(adminUser.isPresent());
        assertEquals("admin", adminUser.get().getUsername());
    }
}
