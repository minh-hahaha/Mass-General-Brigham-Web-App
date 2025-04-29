import { useEffect, useState } from 'react';
import { getServiceRequest, incomingServiceRequest } from '@/database/serviceRequest.ts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";