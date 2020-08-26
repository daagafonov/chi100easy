package ua.chi100easy.api.rest;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.chi100easy.api.exception.NotFoundException;
import ua.chi100easy.api.model.User;
import ua.chi100easy.api.repository.UserRepository;

import javax.websocket.server.PathParam;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * @author exdag
 */
@RestController
@RequestMapping("/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepository repository;

    @GetMapping("/all")
    public List<User> getAll() {
        return repository.findAll();
    }

    @GetMapping(value = "/{telegramUserId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public User getUser(@PathVariable("telegramUserId") String telegramUserId) {
        return repository.findByTelegramUserId(telegramUserId).orElseThrow(NotFoundException::new);
    }

    @PutMapping("/{telegramUserId}")
    public void update(@PathVariable("telegramUserId") String telegramUserId, @RequestBody User user) {
        User user2Update = repository.findByTelegramUserId(telegramUserId).orElseThrow(NotFoundException::new);
        if (!StringUtils.isEmpty(user.getPhoneNumber())) {
            user2Update.setPhoneNumber(user.getPhoneNumber());
        }
        if(!StringUtils.isEmpty(user.getLongitude())) {
            user2Update.setLongitude(user.getLongitude());
        }
        if(!StringUtils.isEmpty(user.getLatitude())) {
            user2Update.setLatitude(user.getLatitude());
        }
        repository.save(user2Update);
    }

    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
    public User create(@RequestBody User user) {

        logger.debug("%s, %s, %s, %s", user.getFirstName(), user.getLastName(), user.getUsername(), user.getTelegramUserId());

        Optional<User> userOpt = repository.findByTelegramUserId(user.getTelegramUserId());
        if (!userOpt.isPresent()) {
            user.setId(ObjectId.get().toString());
            repository.insert(user);
            return repository.findById(user.getId()).get();
        } else {
            return userOpt.get();
        }
    }

}
