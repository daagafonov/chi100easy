package ua.chi100easy.api.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import ua.chi100easy.api.model.User;

import java.util.Optional;

/**
 * @author exdag
 */
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByTelegramUserId(String telegramUserId);
}
