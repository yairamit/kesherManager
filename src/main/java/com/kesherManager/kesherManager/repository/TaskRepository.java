package com.kesherManager.kesherManager.repository;

import com.kesherManager.kesherManager.model.Box;
import com.kesherManager.kesherManager.model.Task;
import com.kesherManager.kesherManager.model.Transport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Find tasks by status
    List<Task> findByStatus(Task.TaskStatus status);

    // Find tasks by priority
    List<Task> findByPriority(Task.TaskPriority priority);

    // Find overdue tasks (due date is before current date and not completed)
    List<Task> findByDueDateBeforeAndStatusNot(Date currentDate, Task.TaskStatus completedStatus);

    // Find tasks related to a specific box
    List<Task> findByRelatedBox(Box box);

    // Find tasks related to a specific transport
    List<Task> findByRelatedTransport(Transport transport);

    // Find tasks assigned to a specific person
    List<Task> findByAssignedTo(String assignedTo);

    // Find tasks by type
    List<Task> findByTaskType(Task.TaskType taskType);

    // Find tasks due between two dates
    List<Task> findByDueDateBetween(Date startDate, Date endDate);

    // Find tasks by priority and status
    List<Task> findByPriorityAndStatus(Task.TaskPriority priority, Task.TaskStatus status);
}