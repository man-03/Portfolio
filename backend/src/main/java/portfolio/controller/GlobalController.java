package portfolio.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import portfolio.dto.GlobalResponseDTO;
import portfolio.service.GlobalService;

@RestController
@RequestMapping("/api/public")
public class GlobalController {

    final private GlobalService globalService;

    public GlobalController(GlobalService globalService) {
        this.globalService = globalService;
    }

    @PostMapping("/{userName}")
    public ResponseEntity<GlobalResponseDTO> userOnLoad(@PathVariable String userName) {
        GlobalResponseDTO response = globalService.userOnLoad(userName);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
