# A.부록: ALTIBASE-MIB

이 부록에서는 ALTIBASE-MIB.txt 파일을 첨부한다.

### ALTIBASE-MIB.txt

```
ALTIBASE-MIB DEFINITIONS::= BEGIN
     
IMPORTS
    OBJECT-TYPE, NOTIFICATION-TYPE, MODULE-IDENTITY, enterprises
        FROM SNMPv2-SMI
    DisplayString
        FROM SNMPv2-TC;
     
     
altibase MODULE-IDENTITY
    LAST-UPDATED "201410310000Z"
    ORGANIZATION "ALTIBASE R&D Division"
    CONTACT-INFO "Altibase Corporation
                  10F, DaerungPost Tower2, 182-13 Guro-dong,
                  Guro-gu, Seoul
                  150-790,
                  Korea
                  TEL. +82-2-2082-1000
                  http://support.altibase.com"
    DESCRIPTION  "This MIB module defines Altibase MIB."
    ::= { enterprises 17180 }
     
     
altiTrap OBJECT IDENTIFIER ::= { altibase 1 }
     
altiNotification NOTIFICATION-TYPE
    OBJECTS     { altiTrapAddress, altiTrapLevel, altiTrapCode,                                   
                  altiTrapMessage, altiTrapMoreInfo }                                             
    STATUS      current
    DESCRIPTION "altiNotification"      
    ::= { altiTrap 1 }
     
altiTrapAddress OBJECT-TYPE
    SYNTAX      DisplayString
    MAX-ACCESS  read-only
    STATUS      current
    DESCRIPTION "The Altibase port number in use."
    ::= { altiTrap 2 }
     
altiTrapLevel OBJECT-TYPE
    SYNTAX      DisplayString
    MAX-ACCESS  read-only
    STATUS      current
    DESCRIPTION "Trap Level = 1|2|3"
    ::= { altiTrap 3 }
     
altiTrapCode OBJECT-TYPE
    SYNTAX      DisplayString
    MAX-ACCESS  read-only
    STATUS      current
    DESCRIPTION "Trap Code."
    ::= { altiTrap 4 }
     
altiTrapMessage OBJECT-TYPE
    SYNTAX      DisplayString
    MAX-ACCESS  read-only
    STATUS      current 
    DESCRIPTION "The trap message."
    ::= { altiTrap 5 }
                                                                               
altiTrapMoreInfo OBJECT-TYPE                                                  
    SYNTAX      DisplayString                                                 
    MAX-ACCESS  read-only                                                     
    STATUS      current                                                       
    DESCRIPTION "The reserved field"                                         
    ::= { altiTrap 6 }                                                        
                                                                               
                                                                               
altiPropertyTable OBJECT-TYPE                                                 
    SYNTAX      SEQUENCE OF AltiPropertyEntry                                 
    MAX-ACCESS  not-accessible                                                
    STATUS      current                                                       
    DESCRIPTION "altiPropertyTable"                                          
    ::= { altibase 2 }                                                        
                                                                               
altiPropertyEntry OBJECT-TYPE                                                 
    SYNTAX      AltiPropertyEntry                                             
    MAX-ACCESS  not-accessible                                                
    STATUS      current                                                       
    DESCRIPTION "altiPropertyEntry"                                          
    INDEX       { altiPropertyIndex }                                         
    ::= { altiPropertyTable  1 }                                              
                                                                               
altiPropertyEntry ::= SEQUENCE {                                              
    altiPropertyIndex                    INTEGER,                             
    altiPropertyAlarmQueryTimeout        DisplayString,                       
    altiPropertyAlarmUtransTimeout       DisplayString,                       
    altiPropertyAlarmFetchTimeout        DisplayString,                       
    altiPropertyAlarmSessionFailureCount DisplayString,                       
}                                                                             
                                                                               
altiPropertyIndex OBJECT-TYPE                                                 
    SYNTAX      INTEGER                                                       
    MAX-ACCESS  read-only                                                     
    STATUS      current                                                       
    DESCRIPTION "altiPropertyIndex"                                          
    ::= { altiPropertyEntry 1 }                                               
                                                                               
altiPropertyAlarmQueryTimeout OBJECT-TYPE                                     
    SYNTAX      DisplayString                                                 
    MAX-ACCESS  read-write                                                    
    STATUS      current                                                       
    DESCRIPTION "altiPropertyAlarmQueryTimeout 0|1                           
                 Zero : Do nothing.                                           
                 One  : Send the trap when a query timeout occurs in a session." 
    ::= { altiPropertyEntry 2 }                                               
                                                                               
altiPropertyAlarmUtransTimeout OBJECT-TYPE                                    
    SYNTAX      DisplayString                                                 
    MAX-ACCESS  read-write                                                    
    STATUS      current                                                       
    DESCRIPTION "altiPropertyAlarmUtransTimeout 0|1                          
                 Zero : Do nothing.                                           
                 One  : Send the trap when a utrans timeout occurs in a session."
    ::= { altiPropertyEntry 3 }                                               
                                                                               
altiPropertyAlarmFetchTimeout OBJECT-TYPE                                     
    SYNTAX      DisplayString                                                 
    MAX-ACCESS  read-write                                                                                               
    STATUS      current                                                                                                  
    DESCRIPTION "altiPropertyAlarmFetchTimeout 0|1                                                                      
                 Zero : Do nothing.                                                                                      
                 One  : Send the trap when a fetch timeout occurs in a session. "                                            
    ::= { altiPropertyEntry 4 }                                                                                          
                                                                                                                          
altiPropertyAlarmSessionFailureCount OBJECT-TYPE                                                                         
    SYNTAX      DisplayString                                                                                            
    MAX-ACCESS  read-write                                                                                               
    STATUS      current                                                                                                  
    DESCRIPTION "altiPropertyAlarmessionFailureCount [0..4294967295]                                                     
                 Zero     : Do nothing.                                                                                  
                 Non-zero : Send the trap when query execution continues to fail for as many times as altiPropertyAlarmSessionFailureCount."
    ::= { altiPropertyEntry 5 }                                                                                          
                                                                                                                          
                                                                                                                          
                                                                                                                          
altiStatus OBJECT IDENTIFIER ::= { altibase 3 }                                                                          
                                                                                                                          
altiStatusTable OBJECT-TYPE                                                                                              
    SYNTAX      SEQUENCE OF altiStatusEntry                                                                              
    MAX-ACCESS  not-accessible                                                                                           
    STATUS      current                                                                                                  
    DESCRIPTION "altiStatusTable"                                                                                       
    ::= { altiStatus  1 }                                                                                                
                                                                                                                          
altiStatusEntry OBJECT-TYPE                                                                                              
    SYNTAX      altiStatusEntry                                                                                          
    MAX-ACCESS  not-accessible                                                                                           
    STATUS      current                                                                                                  
    DESCRIPTION "altiStatusEntry"                                                                                       
    INDEX       { altiStatusIndex }                                                                                      
    ::= { altiStatusTable 1 }                                                                                            
                                                                                                                          
altiStatusEntry ::= SEQUENCE {                                                                                           
    altiStatusIndex         INTEGER,                                                                                     
    altiStatusDBName        DisplayString,                                                                               
    altiStatusDBVersion     DisplayString,                                                                               
    altiStatusRunningTime   DisplayString,                                                                               
    altiStatusProcessID     DisplayString,                                                                               
    altiStatusSessionCount  DisplayString                                                                                
}                                                                                                                        
                                                                                                                          
altiStatusIndex OBJECT-TYPE                                                                                              
    SYNTAX      INTEGER                                                                                                  
    MAX-ACCESS  read-only                                                                                                
    STATUS      current                                                                                                  
    DESCRIPTION "altiStatusIndex"                                                                                       
    ::= { altiStatusEntry 1 }                                                                                            
                                                                                                                          
altiStatusDBName OBJECT-TYPE                                                                                             
    SYNTAX      DisplayString                                                                                            
    MAX-ACCESS  read-only                                                                                                
    STATUS      current                                                                                                  
    DESCRIPTION "The Altibase database name."                                                                      
    ::= { altiStatusEntry 2 }                                                                                            
                                                                                                                          
altiStatusDBVersion OBJECT-TYPE                                                                                          
    SYNTAX      DisplayString                               
    MAX-ACCESS  read-only                                   
    STATUS      current                                     
    DESCRIPTION "The Altibase version."                 
    ::= { altiStatusEntry 3 }                               
                                                             
altiStatusRunningTime OBJECT-TYPE                           
    SYNTAX      DisplayString                               
    MAX-ACCESS  read-only                                   
    STATUS      current                                     
    DESCRIPTION "altiStatusRunningTime = [dd days, HH:MM:SS]
                 The Altibase run time."                 
    ::= { altiStatusEntry 4 }                               
                                                             
altiStatusProcessID OBJECT-TYPE                             
    SYNTAX      DisplayString                               
    MAX-ACCESS  read-only                                   
    STATUS      current                                     
    DESCRIPTION "altiStatusProcessID = PID                  
                 Process ID of Altibase."                   
   ::= { altiStatusEntry 5 }                                
                                                             
altiStatusSessionCount OBJECT-TYPE                          
    SYNTAX      DisplayString                               
    MAX-ACCESS  read-only                                   
    STATUS      current                                     
    DESCRIPTION " The number of currently open Altibase sessions."       
   ::= { altiStatusEntry 6 }                                
                                                             
END
```

