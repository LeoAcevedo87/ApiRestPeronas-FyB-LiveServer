
package com.apicacion.service;

import com.apicacion.model.Persona;
import com.apicacion.repository.IPersonaRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonaService implements IPersonaService{
    
    @Autowired IPersonaRepository persoRepo;
    
    @Override
    public void createPersona(Persona persona) {
        persoRepo.save(persona);
    }
    
    @Override
    public Persona getPersona(Long id) {
        return persoRepo.findById(id).orElse(null);
    }
    
    @Override
    public List<Persona> getListPersonas() {
        return persoRepo.findAll();
    }
    
    @Override
    public void editPersona(Persona persona) {
        this.createPersona(persona);
    }
    
    @Override
    public void deletePersona(Long id) {
        persoRepo.deleteById(id);
    }   
    
}
