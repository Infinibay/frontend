"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { UserPc } from "@/components/ui/user-pc";
import { 
  DndContext, 
  DragOverlay,
  useSensor, 
  useSensors, 
  PointerSensor,
  useDroppable,
  useDraggable
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "@/components/ui/sortable-item";
import { moveMachine } from "@/state/slices/vms";

function DraggableUserPc({ machine, selected, onSelect, size }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: machine.id,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <UserPc
        pc={machine}
        name={machine.name}
        status={machine.status?.toLowerCase()}
        selected={selected}
        onClick={onSelect}
        size={size}
        className={cn(isDragging && "opacity-50")}
      />
    </div>
  );
}

function DroppableDepartment({ departmentId, departmentName, children, isOver }) {
  const { setNodeRef } = useDroppable({
    id: departmentId,
  });

  return (
    <div ref={setNodeRef} className="space-y-4">
      {departmentName && (
        <h2 className="text-2xl font-semibold tracking-tight">
          {departmentName}
        </h2>
      )}
      <div
        className={cn(
          "min-h-[100px] p-4 rounded-lg border border-dashed transition-colors",
          isOver ? "border-primary bg-primary/5" : "border-border"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ComputersList({
  loading,
  error,
  groupedMachines,
  byDepartment,
  grid,
  selectedPc,
  onSelectMachine,
  size,
}) {
  const dispatch = useDispatch();
  const [activeId, setActiveId] = useState(null);
  const [activeMachine, setActiveMachine] = useState(null);
  const [overDepartmentId, setOverDepartmentId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    
    // Find the machine being dragged
    for (const [, departmentData] of Object.entries(groupedMachines)) {
      const machine = (departmentData.machines || []).find(m => m.id === active.id);
      if (machine) {
        setActiveMachine(machine);
        break;
      }
    }
  };

  const handleDragOver = (event) => {
    const { over } = event;
    setOverDepartmentId(over?.id || null);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    console.log('Drag end:', { active, over });

    setActiveId(null);
    setActiveMachine(null);
    setOverDepartmentId(null);

    if (over) {
      const destinationId = over.id;
      console.log('Moving machine:', { machineId: active.id, departmentId: destinationId });
      await dispatch(moveMachine({ id: active.id, departmentId: destinationId }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <div>Loading machines...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error loading machines: {error}
      </div>
    );
  }

  const machineCount = Object.values(groupedMachines).reduce(
    (count, group) => count + (group.machines?.length || group.length || 0),
    0
  );

  if (machineCount === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No machines found
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-8">
        {Object.entries(groupedMachines).map(([departmentId, departmentData]) => (
          <DroppableDepartment
            key={departmentId}
            departmentId={departmentId}
            departmentName={byDepartment ? departmentData.name : null}
            isOver={overDepartmentId === departmentId}
          >
            <div className={cn(
              "gap-4",
              grid
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "flex flex-wrap"
            )}>
              {(departmentData.machines || []).map((machine) => (
                <DraggableUserPc
                  key={machine.id}
                  machine={machine}
                  selected={selectedPc?.id === machine.id}
                  onSelect={() => onSelectMachine(machine)}
                  size={size}
                />
              ))}
              {byDepartment && (!departmentData.machines || departmentData.machines.length === 0) && (
                <div className="text-center p-8 text-muted-foreground col-span-full">
                  No machines found
                </div>
              )}
            </div>
          </DroppableDepartment>
        ))}
      </div>
      <DragOverlay>
        {activeMachine && (
          <UserPc
            pc={activeMachine}
            name={activeMachine.name}
            status={activeMachine.status?.toLowerCase()}
            className="opacity-50"
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
