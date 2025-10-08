"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { UserPc } from "@/components/ui/user-pc";
import { SimpleIllustration } from "@/components/ui/undraw-illustration";
import { Button } from "@/components/ui/button";
import { fetchVms } from "@/state/slices/vms";
import { countMachines } from "@/app/computers/utils/groupMachines";
import { createDebugger } from '@/utils/debug';
import { getGlassClasses } from "@/utils/glass-effects";
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

const debug = createDebugger('frontend:components:computers-list');

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
          "min-h-[100px] p-4 transition-all duration-200",
          getGlassClasses({
            glass: isOver ? 'medium' : 'subtle',
            elevation: isOver ? 3 : 2,
            radius: 'lg'
          }),
          isOver && "border-primary/30 bg-primary/10"
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
    debug.log('drag', 'Drag end:', { active, over });

    setActiveId(null);
    setActiveMachine(null);
    setOverDepartmentId(null);

    if (over) {
      const dropData = over.data?.current;
      if (dropData?.type === 'department' && dropData.departmentId) {
        await dispatch(moveMachine({ id: active.id, departmentId: dropData.departmentId }));
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
    const isNetworkError = error.includes('Network error') || error.includes('fetch') || error.includes('connection');

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <SimpleIllustration
          name="error"
          size="small"
          opacity={80}
          className="mb-4"
        />
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-destructive">
            {isNetworkError ? 'Connection Error' : 'Loading Error'}
          </h3>
          <p className="text-muted-foreground max-w-md">
            {isNetworkError
              ? 'Unable to connect to the backend server. Please check your connection and try again.'
              : `Error loading machines: ${error}`
            }
          </p>
          <Button
            onClick={() => dispatch(fetchVms())}
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const machineCount = countMachines(groupedMachines);

  if (machineCount === 0) {
    const noDataLoaded = !loading && !error && (!groupedMachines || Object.keys(groupedMachines).length === 0);

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <SimpleIllustration
          name="not-found"
          size="large"
          opacity={80}
          className="mb-4"
        />
        <div className={cn(
          "text-center space-y-2 p-6 rounded-lg",
          getGlassClasses({
            glass: 'minimal',
            elevation: 2,
            radius: 'lg'
          })
        )}>
          <p className="text-lg text-glass-text-primary">
            {noDataLoaded ? 'No data loaded yet' : 'No virtual machines found'}
          </p>
          <p className="text-sm text-glass-text-secondary">
            {noDataLoaded
              ? 'Data may still be loading or there might be a connection issue'
              : 'Create your first virtual machine to get started'
            }
          </p>
          {noDataLoaded && (
            <Button
              onClick={() => dispatch(fetchVms())}
              variant="outline"
              className="mt-4"
            >
              Load Machines
            </Button>
          )}
        </div>
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
                  <SimpleIllustration
                    name="not-found"
                    size="medium"
                    opacity={80}
                    className="mb-4"
                  />
                  <div className={cn(
                    "text-center p-4 rounded-lg",
                    getGlassClasses({
                      glass: 'subtle',
                      elevation: 1,
                      radius: 'md'
                    })
                  )}>
                    <p className="text-glass-text-primary">No machines in this department</p>
                  </div>
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
