/***************************************************************************
 * Notes:
 * - Mock data to simulate an API call.
 ***************************************************************************/

export function getModuleTemplate(id: string) {
  const templates = [
    generic_gen1_ecu,
    generic_gen2_ecu,
    generic_gen1_pdm,
    generic_gen2_pdm,
  ];

  for (const template of templates) {
    if (template.id === id) {
      return template;
    }
  }
}

export function getModuleDesignTemplate() {
  const templates = [generic_gen1_ecu];

  return templates[0];
}

const generic_gen1_ecu = {
  id: "1",
  connectors: [
    {
      ConnectorA: {
        Pin1: "SENSOR-GROUND",
        Pin2: "AVI 4",
        Pin3: "DPO 6",
        Pin4: "STEPPER 1 P3 / DPO",
        Pin5: "STEPPER 1 P4 / DPO",
        Pin6: "STEPPER 1 P2 / DPO",
        Pin7: "STEPPER 1 P1 / DPO",
        Pin8: "+5V SUPPLY",
        Pin9: "AVI 9 (MAP*)",
      },
    },
    {
      ConnectorB: {
        Pin1: "SENSOR-GROUND",
        Pin2: "AVI 4",
        Pin3: "DPO 6",
        Pin4: "STEPPER 1 P3 / DPO",
        Pin5: "STEPPER 1 P4 / DPO",
        Pin6: "STEPPER 1 P2 / DPO",
        Pin7: "STEPPER 1 P1 / DPO",
        Pin8: "+5V SUPPLY",
        Pin9: "AVI 9",
      },
    },
  ],
};

const generic_gen2_ecu = {
  id: "2",
  connectors: [
    {
      ConnectorA: {
        Pin1: "SENSOR-GROUND",
        Pin2: "AVI 4",
        Pin3: "DPO 6",
        Pin4: "STEPPER 1 P3 / DPO",
        Pin5: "STEPPER 1 P4 / DPO",
        Pin6: "STEPPER 1 P2 / DPO",
        Pin7: "STEPPER 1 P1 / DPO",
        Pin8: "+5V SUPPLY",
        Pin9: "AVI 9 (MAP*)",
      },
    },
    {
      ConnectorB: {
        Pin1: "SENSOR-GROUND",
        Pin2: "AVI 4",
        Pin3: "DPO 6",
        Pin4: "STEPPER 1 P3 / DPO",
        Pin5: "STEPPER 1 P4 / DPO",
        Pin6: "STEPPER 1 P2 / DPO",
        Pin7: "STEPPER 1 P1 / DPO",
        Pin8: "+5V SUPPLY",
        Pin9: "AVI 9",
      },
    },
  ],
};

const generic_gen1_pdm = {
  id: "3",
  connectors: [
    {
      ConnectorA: {
        Pin1: "SENSOR-GROUND",
        Pin2: "AVI 4",
        Pin3: "DPO 6",
        Pin4: "STEPPER 1 P3 / DPO",
        Pin5: "STEPPER 1 P4 / DPO",
        Pin6: "STEPPER 1 P2 / DPO",
        Pin7: "STEPPER 1 P1 / DPO",
        Pin8: "+5V SUPPLY",
        Pin9: "AVI 9 (MAP*)",
      },
    },
    {
      ConnectorB: {
        Pin1: "SENSOR-GROUND",
        Pin2: "AVI 4",
        Pin3: "DPO 6",
        Pin4: "STEPPER 1 P3 / DPO",
        Pin5: "STEPPER 1 P4 / DPO",
        Pin6: "STEPPER 1 P2 / DPO",
        Pin7: "STEPPER 1 P1 / DPO",
        Pin8: "+5V SUPPLY",
        Pin9: "AVI 9",
      },
    },
  ],
};

const generic_gen2_pdm = {
  id: "3",
  connectors: [
    {
      ConnectorA: {
        Pin1: "SENSOR-GROUND",
        Pin2: "AVI 4",
        Pin3: "DPO 6",
        Pin4: "STEPPER 1 P3 / DPO",
        Pin5: "STEPPER 1 P4 / DPO",
        Pin6: "STEPPER 1 P2 / DPO",
        Pin7: "STEPPER 1 P1 / DPO",
        Pin8: "+5V SUPPLY",
        Pin9: "AVI 9 (MAP*)",
      },
    },
    {
      ConnectorB: {
        Pin1: "SENSOR-GROUND",
        Pin2: "AVI 4",
        Pin3: "DPO 6",
        Pin4: "STEPPER 1 P3 / DPO",
        Pin5: "STEPPER 1 P4 / DPO",
        Pin6: "STEPPER 1 P2 / DPO",
        Pin7: "STEPPER 1 P1 / DPO",
        Pin8: "+5V SUPPLY",
        Pin9: "AVI 9",
      },
    },
  ],
};
