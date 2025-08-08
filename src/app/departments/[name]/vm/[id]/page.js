"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { fetchServices, fetchVmServiceStatus, toggleVmService, clearVmServiceOverrides, selectServices } from '@/state/slices/security';

const VmSecurity = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const services = useSelector(selectServices);
    const [serviceId, setServiceId] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        dispatch(fetchServices());
    }, [dispatch]);

    useEffect(() => {
        if (!serviceId || !id) return;
        dispatch(fetchVmServiceStatus({ vmId: id, serviceId }))
            .unwrap()
            .then((list) => setStatus(list?.[0] || null))
            .catch(() => setStatus(null));
    }, [dispatch, id, serviceId]);

    const update = async (action) => {
        if (!serviceId || !id || !status) return;
        const enabled = action === 'use' ? !status.useEnabled : !status.provideEnabled;
        await dispatch(toggleVmService({ vmId: id, serviceId, action, enabled })).unwrap();
        const list = await dispatch(fetchVmServiceStatus({ vmId: id, serviceId })).unwrap();
        setStatus(list?.[0] || null);
    };

    const resetToInherit = async () => {
        await dispatch(clearVmServiceOverrides({ vmId: id, serviceId })).unwrap();
        const list = await dispatch(fetchVmServiceStatus({ vmId: id, serviceId })).unwrap();
        setStatus(list?.[0] || null);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="max-w-xl space-y-2">
                <label className="text-sm font-medium">Service</label>
                <Select value={serviceId || ''} onValueChange={setServiceId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                        {(services || []).map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.displayName}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {status && (
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Switch checked={!!status.useEnabled} onCheckedChange={() => update('use')} />
                            <span>Allow outbound (use)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch checked={!!status.provideEnabled} onCheckedChange={() => update('provide')} />
                            <span>Allow inbound (provide)</span>
                        </div>
                        <div className="ml-auto">
                            <Button variant="outline" onClick={resetToInherit}>Reset to inherit</Button>
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Running: {status.running ? 'Yes' : 'No'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VmSecurity;

const VmPage = () => {
    return (
        <div>
            VmPage
        </div>
    );
}