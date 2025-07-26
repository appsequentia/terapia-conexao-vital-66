import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useUUIDValidation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const validateAndCorrectURL = () => {
      const pathSegments = location.pathname.split('/');
      const possibleUUIDIndex = pathSegments.findIndex(segment => 
        segment.length >= 30 && segment.includes('-')
      );

      if (possibleUUIDIndex !== -1) {
        const possibleUUID = pathSegments[possibleUUIDIndex];
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        
        console.log('[useUUIDValidation] Checking UUID:', possibleUUID);
        console.log('[useUUIDValidation] UUID length:', possibleUUID.length);
        console.log('[useUUIDValidation] Is valid:', uuidRegex.test(possibleUUID));

        if (!uuidRegex.test(possibleUUID)) {
          console.log('[useUUIDValidation] ❌ UUID inválido detectado na URL');
          
          // Tentar corrigir se parece ser um UUID truncado
          if (possibleUUID.length === 35 && possibleUUID.match(/^[0-9a-f-]+$/i)) {
            const correctedUUID = '0' + possibleUUID;
            console.log('[useUUIDValidation] 🔧 Tentando corrigir UUID:', correctedUUID);
            
            if (uuidRegex.test(correctedUUID)) {
              const correctedPath = location.pathname.replace(possibleUUID, correctedUUID);
              console.log('[useUUIDValidation] ✅ Redirecionando para URL corrigida:', correctedPath);
              navigate(correctedPath, { replace: true });
              return;
            }
          }
          
          console.log('[useUUIDValidation] ❌ Não foi possível corrigir o UUID');
        }
      }
    };

    validateAndCorrectURL();
  }, [location.pathname, navigate]);

  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  return { isValidUUID };
};