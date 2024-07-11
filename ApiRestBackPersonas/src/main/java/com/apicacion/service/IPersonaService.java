
package com.apicacion.service;

import com.apicacion.model.Persona;
import java.util.List;

public interface IPersonaService {
    
    public void createPersona(Persona persona);
    
    public Persona getPersona(Long id);
    
    public List<Persona> getListPersonas();
    
    public void editPersona(Persona persona);
    
    public void deletePersona(Long id);
    
}
