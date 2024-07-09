package kesher.manage.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.time.LocalDateTime;

@Entity
public class PickUp {

    private  Box Box;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private LocalDateTime pickupTime;
    private String location;
    private String details;

    @ManyToOne
    private Box box;

    public PickUp() {}

    public PickUp(LocalDateTime pickupTime, String location, String details,Box box) {
        this.pickupTime = pickupTime;
        this.location = location;
        this.details = details;
        this.Box = box;
    }


}

