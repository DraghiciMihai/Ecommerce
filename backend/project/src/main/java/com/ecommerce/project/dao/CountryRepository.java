package com.ecommerce.project.dao;

import com.ecommerce.project.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

//@CrossOrigin("http://localhost:4200")
@RepositoryRestResource
public interface CountryRepository extends JpaRepository<Country, Integer> {
}
