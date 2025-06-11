package com.kesherManager.kesherManager.controller;

import org.joda.time.*;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.kesherManager.kesherManager.util.Dates;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/date-utils")
public class DateController {

    private final DateTimeFormatter dateFormatter = DateTimeFormat.forPattern("yyyy-MM-dd");
    private final DateTimeFormatter dateTimeFormatter = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss");

    @GetMapping("/now")
    public ResponseEntity<Map<String, String>> getCurrentDateTime() {
        Map<String, String> dateInfo = new HashMap<>();

        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();

        dateInfo.put("today", today.toString(dateFormatter));
        dateInfo.put("now", now.toString(dateTimeFormatter));
        dateInfo.put("timezone", DateTimeZone.getDefault().getID());

        return new ResponseEntity<>(dateInfo, HttpStatus.OK);
    }

    @GetMapping("/today")
    public ResponseEntity<Map<String, String>> getTodayDateInfo() {
        Map<String, String> dateInfo = new HashMap<>();

        LocalDate today = LocalDate.now();

        dateInfo.put("date", today.toString(dateFormatter));
        dateInfo.put("dayOfWeek", today.dayOfWeek().getAsText());
        dateInfo.put("dayOfMonth", String.valueOf(today.getDayOfMonth()));
        dateInfo.put("month", today.monthOfYear().getAsText());
        dateInfo.put("year", String.valueOf(today.getYear()));

        // Get start and end of day in ISO format
        LocalDateTime startOfDay = today.toLocalDateTime(new LocalTime(0, 0, 0));
        LocalDateTime endOfDay = today.toLocalDateTime(new LocalTime(23, 59, 59, 999));

        dateInfo.put("startOfDay", startOfDay.toString(dateTimeFormatter));
        dateInfo.put("endOfDay", endOfDay.toString(dateTimeFormatter));

        return new ResponseEntity<>(dateInfo, HttpStatus.OK);
    }

    @GetMapping("/this-week")
    public ResponseEntity<Map<String, Object>> getThisWeekInfo() {
        Map<String, Object> weekInfo = new HashMap<>();

        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.withDayOfWeek(DateTimeConstants.SUNDAY);
        LocalDate endOfWeek = today.withDayOfWeek(DateTimeConstants.SATURDAY);

        weekInfo.put("startDate", startOfWeek.toString(dateFormatter));
        weekInfo.put("endDate", endOfWeek.toString(dateFormatter));

        // Get all days of the week
        Map<String, String> daysOfWeek = new HashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDate day = startOfWeek.plusDays(i);
            String dayName = day.dayOfWeek().getAsText();
            daysOfWeek.put(dayName, day.toString(dateFormatter));
        }

        weekInfo.put("days", daysOfWeek);
        weekInfo.put("weekNumber", today.getWeekOfWeekyear());

        return new ResponseEntity<>(weekInfo, HttpStatus.OK);
    }

    @GetMapping("/this-month")
    public ResponseEntity<Map<String, Object>> getThisMonthInfo() {
        Map<String, Object> monthInfo = new HashMap<>();

        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.dayOfMonth().withMaximumValue();

        monthInfo.put("startDate", startOfMonth.toString(dateFormatter));
        monthInfo.put("endDate", endOfMonth.toString(dateFormatter));
        monthInfo.put("month", today.monthOfYear().getAsText());
        monthInfo.put("year", today.getYear());
        monthInfo.put("daysInMonth", today.dayOfMonth().getMaximumValue());

        return new ResponseEntity<>(monthInfo, HttpStatus.OK);
    }
}