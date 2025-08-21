"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { UserPc } from "@/components/ui/user-pc";
import { LottieAnimation } from "@/components/ui/lottie-animation";
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

function DraggableUserPc({ machine, selected, onSelect, size, onPlay, onPause, onStop, onDelete }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: machine.id,
    data: { type: 'machine' }
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
        onPlay={() => onPlay?.(machine)}
        onPause={() => onPause?.(machine)}
        onStop={() => onStop?.(machine)}
        onDelete={() => onDelete?.(machine)}
        className={cn(isDragging && "opacity-50")}
      />
    </div>
  );
}

function DroppableDepartment({ departmentId, departmentName, children, isOver }) {
  const { setNodeRef } = useDroppable({
    id: departmentId,
    data: { type: 'department', departmentId }
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
  onPlay,
  onPause,
  onStop,
  onDelete,
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
      // Determine drop target; may be a department container or a machine card
      const dropData = over.data?.current;
      const destinationId = dropData?.type === 'department'
        ? dropData.departmentId
        : groupedMachines[over.id]?.id || over.id; // fallback

      console.log('Moving machine:', { machineId: active.id, departmentId: destinationId, dropData });
      // Only dispatch if destinationId looks like a department (skip if it's same as source, optional)
      if (destinationId) {
        await dispatch(moveMachine({ id: active.id, departmentId: destinationId }));
      }
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
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <LottieAnimation
          animationPath="/lottie/not-found.json"
          className="w-64 h-64 opacity-80 mb-4"
          loop={true}
          autoplay={true}
        />
        <p className="text-lg text-muted-foreground">No virtual machines found</p>
        <p className="text-sm text-muted-foreground mt-2">Create your first virtual machine to get started</p>
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
                  onPlay={onPlay}
                  onPause={onPause}
                  onStop={onStop}
                  onDelete={onDelete}
                />
              ))}
              {byDepartment && (!departmentData.machines || departmentData.machines.length === 0) && (
                <div className="flex flex-col items-center justify-center min-h-[300px] p-8 col-span-full">
                  <LottieAnimation
                    animationPath="/lottie/not-found.json"
                    className="w-48 h-48 opacity-80 mb-4"
                    loop={true}
                    autoplay={true}
                  />
                  <p className="text-muted-foreground">No machines in this department</p>
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
